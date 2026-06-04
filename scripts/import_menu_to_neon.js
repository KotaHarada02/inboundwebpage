#!/usr/bin/env node
/*
  Sync JSON menu files → Neon (Postgres) `menu` table (id TEXT, payload JSONB).
  Upserts all items from infrastructure/data/menu/*.json and deletes any DB rows
  whose id is not present in the JSON files (removes discontinued items).

  Usage:
    node scripts/import_menu_to_neon.js
  Requires DATABASE_URL (or NEON_DATABASE_URL) in environment, e.g. from .env.local
*/
const fs = require('fs');
const path = require('path');

function loadEnvIfMissing() {
  if (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL) return;
  const envFiles = ['.env.development.local', '.env.local'];
  for (const f of envFiles) {
    const p = path.resolve(__dirname, '..', f);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(.*))\s*$/);
      if (m) {
        const key = m[1];
        const value = m[2] ?? m[3] ?? m[4] ?? '';
        process.env[key] = value;
      }
    }
    break;
  }
}

async function main() {
  loadEnvIfMissing();

  const connectionString =
    process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.NEON_URL || '';
  if (!connectionString) {
    console.error('No database connection string found. Set DATABASE_URL or NEON_DATABASE_URL in .env.local');
    process.exit(1);
  }

  const { Client } = require('@neondatabase/serverless');
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const menuDir = path.resolve(__dirname, '..', 'infrastructure', 'data', 'menu');
    const files = fs.readdirSync(menuDir).filter(f => f.endsWith('.json'));

    // Load all items from JSON files
    const allItems = [];
    for (const f of files) {
      let arr;
      try {
        arr = JSON.parse(fs.readFileSync(path.join(menuDir, f), 'utf8'));
      } catch (e) {
        console.warn('skip', f, e.message);
        continue;
      }
      for (const item of arr) {
        if (item && item.id) allItems.push(item);
      }
    }

    console.log(`Loaded ${allItems.length} items from ${files.length} JSON files`);

    // Upsert all items
    for (const item of allItems) {
      await client.query(
        `INSERT INTO menu (id, payload)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload`,
        [item.id, JSON.stringify(item)]
      );
      console.log('upserted', item.id);
    }

    // Delete DB rows no longer in JSON (discontinued items)
    const currentIds = allItems.map(i => i.id);
    const { rows } = await client.query('SELECT id FROM menu');
    const dbIds = rows.map(r => r.id);
    const toDelete = dbIds.filter(id => !currentIds.includes(id));

    for (const id of toDelete) {
      await client.query('DELETE FROM menu WHERE id = $1', [id]);
      console.log('deleted', id);
    }

    console.log(`\nSync complete: ${allItems.length} upserted, ${toDelete.length} deleted`);
  } finally {
    await client.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
