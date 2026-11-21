/**
 * Neon (Postgres) の menu テーブルを読み、Cloudflare D1 に流し込むための
 * バッチ JSON（`cf d1 query <id> --batch @file`）を書き出す。
 *
 * Usage: node scripts/export_neon_to_d1.cjs [出力先] (default: .cloudflare/d1-menu-import.json)
 *
 * 接続文字列は DATABASE_URL / NEON_DATABASE_URL、なければ .env.development.local から読む。
 * 値は表示しない。出力ファイルはメニューの公開データだけを含む。
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('@neondatabase/serverless');

function readConnectionString() {
  let connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  const envPath = path.join(__dirname, '../.env.development.local');
  if (!connectionString && fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const match = line.match(/^(DATABASE_URL|NEON_DATABASE_URL)=(.*)$/);
      if (match) {
        connectionString = match[2].trim().replace(/^"(.*)"$/, '$1');
        break;
      }
    }
  }
  return connectionString;
}

async function main() {
  const connectionString = readConnectionString();
  if (!connectionString) {
    console.error('DATABASE_URL or NEON_DATABASE_URL not found');
    process.exit(1);
  }

  const outPath = path.resolve(process.argv[2] || path.join(__dirname, '../.cloudflare/d1-menu-import.json'));
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const res = await client.query('SELECT id, payload, sort_order FROM menu ORDER BY sort_order ASC, id ASC');
    // 既存行を消してから全件を入れ直す（何度実行しても同じ結果になる）
    const batch = [{ sql: 'DELETE FROM menu' }];
    for (const row of res.rows) {
      batch.push({
        sql: 'INSERT INTO menu (id, payload, sort_order) VALUES (?, ?, ?)',
        params: [row.id, JSON.stringify(row.payload), String(row.sort_order ?? 0)],
      });
    }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(batch));
    console.log(`Exported ${res.rows.length} rows to ${path.relative(process.cwd(), outPath)}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
