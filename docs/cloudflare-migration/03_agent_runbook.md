# 03. 汎用 AI エージェント実行ランブック（Phase 0 〜 Phase 7）

このランブックは、任意の AI コーディングエージェント（または開発者）が **Phase 0 から順番に迷わず実行・検証・ロールバック** できる手順書です。  
各 Phase の **「合格基準」をすべて満たすまで次の Phase に進まないでください。**

> [!NOTE]
> **前提ディレクトリ**: コマンドはすべて原則 `/Users/kouta1/mitsuka_analysis/InboundWebPage`（リポジトリルート）で実行します。  
> **シークレット禁止**: `.env.development.local` や環境変数の**値**をコンソール表示・ログ保存・コミットしないでください。

---

## Phase 0: リポジトリ同期・バックアップ・現状確認

* **実行主体**: AI 自動（リポジトリ乖離がある場合は人間確認）
* **停止条件（Human Gate）**: ローカル `main` と本番 Vercel 元の `KotaHarada02/inboundwebpage` に差分がある場合、マージ・取得方針を人間の承認を得てから進める。

### 手順

1. **Git 状態・リモート確認＆最新本番コードの同期**
   ```bash
   git status
   git remote -v
   git log --oneline -5
   ```
   * 本番 Vercel は `https://github.com/KotaHarada02/inboundwebpage`（コミット `454cb24` 以降）からデプロイされている。ローカル `origin`（`MitsukaAnalysisTeam/InboundWebPage`）と異なる場合、人間に確認の上でリモート追加・最新取得を行う：
   ```bash
   # 例（人間確認後に実行）
   git remote add vercel-prod https://github.com/KotaHarada02/inboundwebpage.git
   git fetch vercel-prod
   git checkout -b feat/cloudflare-migration vercel-prod/main
   ```
   （※すでに `origin/main` へ統合済みの場合は `git checkout -b feat/cloudflare-migration origin/main`）

2. **原本画像の外部バックアップ（リポジトリ外へ退避）**
   ```bash
   mkdir -p /tmp/inbound-images-backup
   cp -R public/images/* /tmp/inbound-images-backup/
   ```

3. **必要な環境変数キー名の確認（値なし）＆依存インストール**
   ```bash
   awk -F= '/^[A-Za-z_]/ {print $1}' .env.development.local 2>/dev/null || true
   npm ci
   ```

### 検証コマンド & 合格基準

```bash
git branch --show-current && diff -rq public/images /tmp/inbound-images-backup
```
* **合格基準**:
  * カレントブランチが `feat/cloudflare-migration` であること（`main` ではない）。
  * `diff -rq` の出力が空（差分ゼロ）であること。
  * `DATABASE_URL`（または `NEON_DATABASE_URL`）、`ADMIN_PASSWORD`、`AUTH_SECRET` の存在を確認済み（または本番取得方法を把握済み）であること。

---

## Phase 1: 画像圧縮・最適化 & アセット監査修正

* **実行主体**: AI 自動（画像削除・OGP 差し替え判断のみ人間確認）
* **前提条件**: Phase 0 合格済み（`/tmp/inbound-images-backup` が存在すること）。

### 手順

1. **圧縮ツール（`sharp`）の一時導入または実行**
   * 本番依存を汚さないよう `devDependencies`（または一時ディレクトリ）で `sharp` を利用する。
   ```bash
   npm install -D sharp
   ```
2. **一括圧縮スクリプト `scripts/compress-images.mjs` の作成**
   * 以下の仕様を満たす Node.js スクリプトを作成する：
     * `--dry-run`（既定）と `--apply` オプションを持つ。
     * 対象: `public/images/` 配下の `.jpg`, `.jpeg`, `.png`（拡張子は維持して上書き、DB の `imageUrl` を壊さない）。
     * **EXIF 回転の保持**: 必ず `sharp(file).rotate()` を最初に呼び、縦横の向き崩れを防ぐ。
     * **リサイズ＆圧縮パラメータ**:
       * `public/images/hero/*`: 長辺上限 `1920px` (`withoutEnlargement: true`)、JPEG `quality: 80, mozjpeg: true, progressive: true`
       * `public/images/menu/*`: 長辺上限 `1200px`、JPEG `quality: 78, mozjpeg: true, progressive: true`
       * `public/images/food-and-drinks/*`: 長辺上限 `1400px`、JPEG `quality: 80, mozjpeg: true` / PNG `palette: true, compressionLevel: 9, quality: 80`
       * `public/images/access/*`: 長辺上限 `1200px`、JPEG `quality: 80, mozjpeg: true`
     * **安全条件**: 圧縮後の方が元ファイルより大きくなった場合は元サイズを上書きしない。
     * **レポート出力**: ファイルごとの Before/After サイズと合計削減率を表示する。
   * *(補足: `sharp` が使えない環境では macOS 標準 `sips -Z 1200 -s formatOptions 78` 等で代替可能だが、EXIF・圧縮率面で `sharp` を優先する)*

3. **Dry-Run 確認と圧縮実行**
   ```bash
   node scripts/compress-images.mjs --dry-run
   node scripts/compress-images.mjs --apply
   ```
   * ※圧縮後も `public/images/food-and-drinks/orize-brewing.png`（元 3.68 MB）が `500 KB` を超える写真画像である場合は、JPEG 変換のうえ `infrastructure/data/` やクライアントコンポーネントの参照パス（`.png` → `.jpg`）更新を人間に提案・承認を得て実施する。

4. **参照切れ・重複・非 ASCII ファイル名の監査と修正**
   ```bash
   node -e '
   const fs = require("fs");
   const files = [
     "app/layout.tsx",
     "components/seo/RestaurantJsonLd.tsx",
     "app/food-and-drinks/FoodAndDrinksClient.tsx",
     "app/events/EventsClient.tsx"
   ];
   for (const f of files) {
     if (!fs.existsSync(f)) continue;
     const txt = fs.readFileSync(f, "utf8");
     const matches = [...txt.matchAll(/\/images\/[A-Za-z0-9_.\-\/]+/g)].map(m => m[0]);
     for (const p of matches) {
       console.log(fs.existsSync("public" + p) ? "OK" : "MISSING", f, p);
     }
   }
   '
   ```
   * `MISSING` と出たパス（`/images/hero/hero-1.jpg`, `/images/hero/hero-2.jpg`, `/images/logo.png`, `/images/food-and-drinks/japanese-pattern-dark.jpg` 等）について：
     * 実在画像への差し替え（例: `hero-1.jpg` は実在する Hero 画像または圧縮後のコピーを配置、存在しない背景画像は CSS グラデーションへ変更、ロゴ未配置なら確認）。
   * 重複ファイル `public/images/menu/midnight-tsukemen-6.jpg` / `.jpeg` は、`infrastructure/data/menu/*.json` および Neon DB 上の参照を確認し、未使用側を削除する。
   * `public/images/hero/多酸酵母山田錦_4_3.jpg` は可能であれば英数字名（例: `akishika-tasankoubo.jpg`）へリネームする（`getHeroImages.ts` 改修と同期）。

### 検証コマンド & 合格基準

```bash
node -e '
const fs = require("fs"), path = require("path");
function walk(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);r.push(...(e.isDirectory()?walk(p):[/\.(jpe?g|png|webp)$/i.test(e.name)?p:[]].flat()))}return r}
const files = walk("public/images");
const sizes = files.map(f => ({ f, s: fs.statSync(f).size })).sort((a,b)=>b.s-a.s);
const totalMB = sizes.reduce((a,b)=>a+b.s,0) / 1024 / 1024;
console.log({ count: files.length, totalMB: Number(totalMB.toFixed(2)), top5: sizes.slice(0,5).map(x=>({f:x.f, kb: Math.round(x.s/1024)})) });
if (totalMB > 10) throw new Error("Total size exceeds 10 MB");
if (sizes[0].s > 500 * 1024) throw new Error("Max file exceeds 500 KB: " + sizes[0].f);
'
```
* **合格基準**:
  * `public/images/` 合計サイズ **≤ 10 MB**（目安 5〜8 MB）。
  * 全ファイル単体サイズ **≤ 500 KB**。
  * コード・メニュー JSON から参照される `/images/...` に `MISSING` が **0 件**。

---

## Phase 2: Cloudflare 互換コード改修

* **実行主体**: AI 自動（`siteConfig.ts` の `.com`/`.jp` 変更は人間確認）
* **前提条件**: Phase 1 合格済み。

### 手順

1. **`next.config.js` / `next.config.ts` の一本化と `unoptimized: true` 設定**
   * `next.config.js` の JSON ルールが必要か確認の上（`tsconfig.json` / Next.js 標準の JSON import で不要なら削除）、`next.config.ts` に統合し `next.config.js` を削除する。
   * `next.config.ts` の `nextConfig` に `images: { unoptimized: true }` を追加する（既存の `securityHeaders` はそのまま保持）。

2. **`lib/getHeroImages.ts` の脱 `fs.readdirSync`**
   * Workers 本番実行時にローカルファイルシステム走査が失敗しないよう、静的な配列返却（またはビルド時生成マニフェスト）へ変更する。
   * 例：
     ```ts
     const HERO_IMAGES = [
       '/images/hero/0031_1N0A0880.jpg',
       '/images/hero/0054_1N0A0937.jpg',
       '/images/hero/0138_1N0A1102.jpg',
       '/images/hero/0303_1N0A1489.jpg',
       '/images/hero/akishika-tasankoubo.jpg',
     ] as const;

     export function getHeroImages(): string[] {
       return [...HERO_IMAGES];
     }
     ```
   * （※Phase 1 で確定した実際のファイル名に合わせる。これによりアプリ本体から `fs` import が完全に消える）

3. **`@vercel/analytics` の撤去**
   * 全ファイルから参照箇所を検索し、`import { Analytics } from '@vercel/analytics/next'` と `<Analytics />` を削除する。
   ```bash
   grep -rn "@vercel" app components lib package.json
   ```
   * `package.json` から `@vercel/analytics` を削除（`npm uninstall @vercel/analytics`）。
   * *(Cloudflare Web Analytics は Phase 5 で Cloudflare ダッシュボードから自動挿入または Beacon タグ追加で有効化)*

4. **API Route のキャッシュヘッダ整備（CPU / DB 負荷対策）**
   * `app/api/menu/route.ts` の `GET` レスポンスに `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` を付与。
   * `app/api/admin/menu/route.ts`, `app/api/admin/menu/reorder/route.ts`, `app/api/admin/login/route.ts`, `app/api/admin/logout/route.ts` に `Cache-Control: private, no-store` を付与。

5. **不要残骸とドメイン設定の確認**
   * `app/[lang]/` に不完全・未使用の残骸（例: `page.tsx 23-32-47-431.tsx`）が残っている場合は、本番ビルドに干渉していないか確認し整理する。
   * `lib/siteConfig.ts` / `app/layout.tsx` の `SITE_URL`（`https://mitsukabose.com` vs `https://www.mitsukabose.jp`）を人間に確認し、正規 URL に合わせる。

### 検証コマンド & 合格基準

```bash
grep -rn "@vercel" app components lib package.json || true
grep -rn "from ['\"]fs['\"]\|require(['\"]fs['\"])" app components lib domain || true
npm run lint && npx tsc --noEmit && npm run build
```
* **合格基準**:
  * `app/`, `components/`, `lib/`, `domain/` 内に `@vercel` および `fs` への依存が **0 件**。
  * `next.config.js` が削除され `next.config.ts` のみ存在すること。
  * 標準の `npm run lint`、`npx tsc --noEmit`、`npm run build` がエラーなく完了すること。

---

## Phase 3: `vinext` 導入・ビルド・ローカル検証（Fallback: OpenNext）

* **実行主体**: AI 自動
* **前提条件**: Phase 2 合格済み。Node.js `>= 22.18`（`node -v` で確認）。

### 手順（標準ルート: `vinext`）

1. **互換性チェック（判定ゲート）**
   ```bash
   node -v
   npx vinext check
   ```
   * 致命的な非互換が出た場合は、下の「フォールバック手順: `@opennextjs/cloudflare`」へ切り替える。

2. **非対話モードでの `vinext init`**
   ```bash
   npx vinext init \
     --platform=cloudflare \
     --name=mitsukabose-inbound \
     --cdn-cache=none \
     --data-cache=none \
     --image-optimization=none
   ```
   * 生成・更新されたファイル（`package.json`, `vite.config.ts`, `cloudflare.config.ts`）をすべて確認する。

3. **設定ファイル・Lint・Gitignore の調整**
   * `cloudflare.config.ts`:
     * `accountId: "96dc0d345a3061736d1f32cd12135662"` を設定（または `CLOUDFLARE_ACCOUNT_ID` 環境変数で指定可能にする）。
     * `compatibilityDate` が `"2026-08-04"` 以降の場合、`compatibilityFlags` に `nodejs_compat` が入っていれば削除可（デフォルト有効）。
     * 静的アセットが Worker を経由せず配信される設定（デフォルト `run_worker_first: false` 相当）であることを確認。
   * `tsconfig.json`: `include` に `".cloudflare/types"` を追加。
   * ESLint ignore（`.eslintrc.json` の `ignorePatterns` または flat config）：`.cloudflare/**`, `.vinext/**`, `dist/**` を追加。
   * `.gitignore`: `.cloudflare/`, `.vinext/`, `dist/`, `.dev.vars` を追加。
   * ローカル試験用 `.dev.vars`（Git 追跡対象外）に `.env.development.local` から `DATABASE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET` をコピー（※値表示禁止）。

4. **ビルドおよびローカルスモークテスト**
   ```bash
   npm run build:vinext && npx tsc --noEmit && npm run lint
   ```
   * 別プロセスで `npm run dev:vinext`（デフォルトポート確認）を起動し、以下を検証：
     ```bash
     # 公開ページ（200 OK）
     for p in / /menu /food-and-drinks /access /events /sitemap.xml /robots.txt; do
       code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$p")
       echo "$p -> $code"
       [ "$code" = "200" ]
     done

     # /ramen リダイレクト（301/307/308）
     curl -s -o /dev/null -w "/ramen -> %{http_code}\n" http://localhost:3000/ramen

     # /api/menu JSON 返却確認
     curl -s -i http://localhost:3000/api/menu | head -n 15

     # 未認証の保護確認（/api/admin/menu -> 401, /admin -> 307/302 リダイレクト）
     curl -s -o /dev/null -w "/api/admin/menu (no auth) -> %{http_code}\n" http://localhost:3000/api/admin/menu
     curl -s -o /dev/null -w "/admin (no auth) -> %{http_code}\n" http://localhost:3000/admin
     ```
   * ブラウザまたは curl で管理ログイン（`POST /api/admin/login`）→ Cookie 付与 → `/api/admin/menu` 200 を確認。

### フォールバック手順（`vinext` に致命的非互換があった場合のみ: `@opennextjs/cloudflare`）

1. `npm install @opennextjs/cloudflare && npm install -D wrangler`
2. `open-next.config.ts` および `wrangler.jsonc` を作成し、必ず以下を設定：
   ```jsonc
   {
     "name": "mitsukabose-inbound",
     "main": ".open-next/worker.js",
     "compatibility_date": "2026-08-04",
     "compatibility_flags": ["nodejs_compat"],
     "assets": {
       "directory": ".open-next/assets",
       "binding": "ASSETS",
       "run_worker_first": false
     }
   }
   ```
3. `npx opennextjs-cloudflare build` → `npx wrangler dev` で同じスモークテストを実施。
4. `npx wrangler deploy --outdir bundled --dry-run` で非圧縮バンドルサイズが **64 MiB 未満** であることを確認。

### 合格基準（共通）
* `npm run build:vinext`（または OpenNext ビルド）、`npx tsc --noEmit`、`npm run lint` がすべて終了コード `0`。
* 上記スモークテストの全エンドポイントが期待ステータスを返し、コンソールに未捕捉例外が出ていないこと。

---

## Phase 4: Cloudflare プレビューデプロイ & E2E 検証

* **実行主体**: AI ＋ 人間承認（**Human Gate 1**）
* **前提条件**: Phase 3 合格済み。Cloudflare アカウント（`96dc0d345a3061736d1f32cd12135662`）の認証完了。

### 手順

1. **【人間操作／確認】Cloudflare 認証と Dry-Run サイズ確認**
   ```bash
   npx cf auth whoami   # 未ログイン時は人間が npx cf auth login を実行
   npx @vinext/cloudflare deploy --dry-run
   ```
   * **確認**: 出力バンドルの合計サイズ（非圧縮）が **64 MiB 未満**、静的アセットが **20,000 ファイル未満・単体 25 MiB 未満** であること。

2. **【人間承認後】シークレット登録と `*.workers.dev` デプロイ**
   * シークレットは画面・履歴に残らない方法で登録する（対話入力または保護された一時 secrets JSON 経由。コマンドライン引数へ直書きしない）：
   ```bash
   npx @vinext/cloudflare deploy
   # 初回デプロイ後、シークレットを登録（--secrets-file または wrangler secret put 対話入力）
   npx wrangler secret put DATABASE_URL --name mitsukabose-inbound
   npx wrangler secret put ADMIN_PASSWORD --name mitsukabose-inbound
   npx wrangler secret put AUTH_SECRET --name mitsukabose-inbound
   ```
   *(注: OpenNext 構成の場合は `npx wrangler deploy` 後に同じく `wrangler secret put` を実行)*

3. **プレビュー URL（`https://mitsukabose-inbound.<subdomain>.workers.dev`）E2E 検証**
   * 全ページ表示（Hero スライドショー、`/menu` 73件表示・画像拡大・時間帯タブ、`/food-and-drinks`、`/access` Google Map、`/events`）。
   * ネットワークタブで画像が **500 KB 以下・200 OK** で返ること、圧縮画像の表示向き（縦横）が正しいことを目視確認。
   * 管理画面 `/admin/login` ログイン → 一覧表示 → ダミー編集＆戻し → 並び替え保存が Neon DB に反映されることを確認。
   * Cloudflare ダッシュボード（Workers Metrics）で **P99 CPU 時間が 10 ms 未満**、エラー 0 件であることを確認。

### 合格基準
* `*.workers.dev` 上で全公開画面・全画像・`/api/menu`・`/admin` CRUD が正常動作する。
* Workers CPU P99 が 10 ms 未満、かつエラー率 0%。

---

## Phase 5: DNS・カスタムドメイン切替 & 本番セキュリティ有効化

* **実行主体**: 人間作業（AI はチェック・手順提示で支援 / **Human Gate 2**）
* **前提条件**: Phase 4 合格済み。

### 手順

1. **既存 DNS レコードの完全エクスポート（切替前必須）**
   * Vercel ダッシュボード（`mitsukabose.jp` の DNS 設定）から全レコード（特に **MX / TXT (SPF・DKIM・サイト所有権確認) / CNAME / A**）を控え、スクリーンショットまたはテキストで保存する。
2. **Cloudflare へのゾーン追加と先行レコード作成**
   * Cloudflare ダッシュボード（アカウント `96dc0d345a3061736d1f32cd12135662`）で `Add a site` → `mitsukabose.jp` → **Free プラン** を選択。
   * 控えた **MX / TXT 等の非 Web レコード** をこの時点で漏れなく登録する。
3. **Workers カスタムドメイン紐付けとリダイレクト設定**
   * Worker `mitsukabose-inbound` の Settings → Domains & Routes で `www.mitsukabose.jp`（および `mitsukabose.jp`）を追加。
   * Cloudflare Redirect Rules（単一リダイレクト・無料枠 10 ルール内）で `mitsukabose.jp/*` → `https://www.mitsukabose.jp/${1}`（301）を設定し、現行 Vercel と同じ URL 挙動を維持する。
4. **レジストラでのネームサーバー（NS）切替**
   * ドメイン管理会社（お名前.com / Xserver ドメイン等）で、NS を `ns1/ns2.vercel-dns.com` から Cloudflare 指定の 2 つへ変更する。
5. **セキュリティ・計測の本番有効化**
   * **SSL/TLS**: Overview → Encryption mode を **Full (Strict)**、Edge Certificates で **Always Use HTTPS** を ON。
   * **WAF / Bot**: Security → Bots → **Bot Fight Mode** を ON（不正スキャンをエッジで遮断）。
   * **Web Analytics**: Cloudflare Web Analytics で `mitsukabose.jp` を登録し、計測開始（プロキシ経由のためダッシュボードから自動スニペット注入可）。

### 検証コマンド & 合格基準

```bash
dig +short mitsukabose.jp NS
curl -sI https://mitsukabose.jp | head -n 10
curl -sI https://www.mitsukabose.jp | head -n 10
curl -s -o /dev/null -w "api/menu -> %{http_code}\n" https://www.mitsukabose.jp/api/menu
```
* **合格基準**:
  * NS が Cloudflare を指していること。
  * `https://mitsukabose.jp` が `https://www.mitsukabose.jp` へ 301 リダイレクト、`https://www.mitsukabose.jp` と `/api/menu` が Cloudflare 経由（`server: cloudflare` ヘッダ）で 200 OK を返すこと。
  * メール送受信等（MX がある店舗ドメインの場合）に影響がないこと。

---

## Phase 6: 並行監視・ロールバック手順・Vercel 停止

* **実行主体**: 人間作業（AI はログ集計支援）
* **監視期間**: NS 切替後 **1〜2 週間**

### 監視 KPI（合格ライン）
* Cloudflare アカウント全体の Workers リクエスト数（`akishika_app` + `InboundWebPage`）が **< 20,000 req/日**（上限 100,000 req/日の 20% 未満）。
* `mitsukabose-inbound` の CPU 超過（Exceeded CPU）が **0 件**、5xx エラーが **0 件**。
* メニュー更新（`/admin`）および `/api/menu` が正常に動作し続けていること。

### 緊急ロールバック手順（問題発生時）
1. ドメインレジストラのネームサーバーを元の **`ns1.vercel-dns.com` / `ns2.vercel-dns.com`** に戻す（または Cloudflare DNS 上で一時的に Vercel CNAME/A へ向ける：DNS Only / 灰色雲）。
2. Vercel 側のプロジェクト・ドメインは監視期間終了まで**削除せず残置**しておくため、DNS を戻すだけで数分〜数時間で復旧できる。

### 最終クローズ（Phase 6 完了）
* 1〜2 週間の安定稼働を確認したら、Vercel プロジェクト `inboundwebpage` からドメイン設定を外し（必要ならプロジェクトを Pause/削除）、作業ブランチを `main` へマージする。

---

## Phase 7（任意）: Neon Postgres → Cloudflare D1 完全移行

Neon の外部接続を解消し、DB も Cloudflare 無料枠（`akishika_app` と合わせて 3/10 DB）へ完全統合したい場合に実施します。

1. **D1 データベース作成＆スキーマ適用**
   ```bash
   npx cf d1 create inbound-menu-db
   # スキーマ適用（id TEXT PRIMARY KEY, payload TEXT NOT NULL, sort_order INTEGER DEFAULT 0）
   ```
2. **Neon からデータダンプ＆D1 インポート**
   * 既存の `scripts/sync_db_to_json.js` または Neon からのエクスポート結果（約 73 件）を SQLite `INSERT OR REPLACE` 文へ変換し、`--local` 検証後に `--remote` へ適用。
3. **バインディング設定と `dbService.ts` 切替**
   * `cloudflare.config.ts` に D1 バインディング `DB` を追加。
   * `domain/services/dbService.ts` を `import { env } from 'cloudflare:workers'` 経由の `env.DB.prepare(...)` 実装へ置き換え（`payload` は `JSON.parse` / `JSON.stringify`）。
   * `@neondatabase/serverless` をアンインストールし、ローカル＆本番で全 CRUD・並び替えを再検証。
