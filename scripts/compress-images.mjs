#!/usr/bin/env node
/**
 * public/images/ 配下のラスター画像を、ファイル名・拡張子を維持したままリサイズ＋再圧縮する。
 *
 *   node scripts/compress-images.mjs            # dry-run（既定。書き込みなし）
 *   node scripts/compress-images.mjs --apply    # 上書き適用
 *
 * - sharp(file).rotate() で EXIF 回転を画素に焼き込み、メタデータは削除する。
 * - ディレクトリ別の長辺上限・品質で圧縮し、目標サイズを超える場合は品質→長辺の順に段階的に下げる。
 * - 圧縮結果が元ファイル以上のサイズになる場合は上書きしない。
 * - 既に長辺上限・目標サイズ以内のファイルは再エンコードしない（再実行時の劣化防止）。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public/images');
const APPLY = process.argv.includes('--apply');
const HARD_LIMIT = 500 * 1024;
const MIN_QUALITY = 60;
const MIN_EDGE = 800;

/** ディレクトリ（public/images からの相対先頭要素）ごとの圧縮ポリシー */
const POLICIES = {
  hero: { maxEdge: 1920, quality: 80, target: 400 * 1024 },
  menu: { maxEdge: 1200, quality: 78, target: 200 * 1024 },
  'food-and-drinks': { maxEdge: 1400, quality: 80, target: 350 * 1024 },
  access: { maxEdge: 1200, quality: 80, target: 200 * 1024 },
  default: { maxEdge: 1200, quality: 80, target: 300 * 1024 },
};

const EXT_RE = /\.(jpe?g|png)$/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      return EXT_RE.test(e.name) ? [p] : [];
    }),
  );
  return files.flat().sort();
}

function policyFor(file) {
  const rel = path.relative(ROOT, file).split(path.sep);
  return rel.length > 1 && POLICIES[rel[0]] ? POLICIES[rel[0]] : POLICIES.default;
}

async function encode(input, isPng, edge, quality) {
  const pipeline = sharp(input)
    .rotate()
    .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true });
  if (isPng) {
    return pipeline.png({ palette: true, compressionLevel: 9, quality, effort: 10 }).toBuffer();
  }
  return pipeline.jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer();
}

async function compress(file) {
  const input = await fs.readFile(file);
  const meta = await sharp(input).metadata();
  const policy = policyFor(file);
  const isPng = /\.png$/i.test(file);
  // EXIF orientation 5-8 は縦横が入れ替わる
  const swap = (meta.orientation ?? 1) >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const longEdge = Math.max(width, height);

  if (longEdge <= policy.maxEdge && input.length <= policy.target && (meta.orientation ?? 1) === 1) {
    return { file, before: input.length, after: input.length, status: 'skip(ok)', dims: `${width}x${height}` };
  }

  let edge = Math.min(longEdge, policy.maxEdge);
  let quality = policy.quality;
  let output = await encode(input, isPng, edge, quality);
  while (output.length > policy.target) {
    if (quality - 5 >= MIN_QUALITY) {
      quality -= 5;
    } else if (Math.round(edge * 0.85) >= MIN_EDGE) {
      edge = Math.round(edge * 0.85);
      quality = policy.quality;
    } else {
      break;
    }
    output = await encode(input, isPng, edge, quality);
  }

  const outMeta = await sharp(output).metadata();
  const dims = `${width}x${height} -> ${outMeta.width}x${outMeta.height} q${quality}`;
  if (output.length >= input.length) {
    return { file, before: input.length, after: input.length, status: 'skip(bigger)', dims };
  }
  if (APPLY) await fs.writeFile(file, output);
  return { file, before: input.length, after: output.length, status: APPLY ? 'written' : 'dry-run', dims };
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`.padStart(8);

const files = await walk(ROOT);
const results = [];
for (const file of files) {
  const r = await compress(file);
  results.push(r);
  console.log(`${kb(r.before)} -> ${kb(r.after)}  ${r.status.padEnd(12)} ${path.relative(process.cwd(), r.file)}  (${r.dims})`);
}

const before = results.reduce((a, r) => a + r.before, 0);
const after = results.reduce((a, r) => a + r.after, 0);
const over = results.filter((r) => r.after > HARD_LIMIT);
console.log('\n' + '-'.repeat(60));
console.log(`files: ${results.length}  mode: ${APPLY ? 'apply' : 'dry-run'}`);
console.log(`total: ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB (-${((1 - after / before) * 100).toFixed(1)}%)`);
console.log(`max:   ${kb(Math.max(...results.map((r) => r.after)))}`);
if (over.length) {
  console.log(`over ${HARD_LIMIT / 1024} KB: ${over.map((r) => path.relative(process.cwd(), r.file)).join(', ')}`);
  process.exitCode = 1;
}
