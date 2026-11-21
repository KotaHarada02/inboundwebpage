# 01. 現状棚卸し・実測データ・Cloudflare 無料枠検証

このドキュメントは、移行元（Vercel Hobby + Neon）および移行先（Cloudflare Free アカウント）の**実測値と技術的棚卸し結果**をまとめた根拠資料です。

---

## 1. 現行システム構成（`InboundWebPage`）

| 項目 | 現在の仕様 | 備考 / 移行時の論点 |
| :--- | :--- | :--- |
| **フレームワーク** | Next.js `15.3.2` (App Router) / React `19.0.0` | `tsconfig.json`・ESLint (`eslint-config-next 15.3.2`) |
| **ランタイム / CSS** | Node.js `22.x` / Tailwind CSS `v4` / TypeScript `5` | `package.json` の `@vercel/analytics` は撤去対象 |
| **ホスティング** | Vercel Hobby (`team_P0VqNbKoU39vdMrP2LVmhu87` / `prj_lvLdz4nXJfBz53ih4VEcWSEl7rFw`) | 月11回未満の低頻度デプロイ（1回 41〜66 秒） |
| **公開ドメイン / DNS** | `mitsukabose.jp` → `www.mitsukabose.jp`（Vercel DNS: `ns1/ns2.vercel-dns.com`） | ※コード内 `lib/siteConfig.ts` は `mitsukabose.com` 記載あり（要確認） |
| **公開ページ** | `/`, `/menu`, `/food-and-drinks`, `/access`, `/events`, `/ramen` (308/301→`/menu`), `/sitemap.xml`, `/robots.txt` | `/` のみ `lib/getHeroImages.ts` で `fs.readdirSync` を使用 |
| **管理画面** | `/admin`, `/admin/login`（Client Component） | `middleware.ts` + `jose`（HS256 JWT Cookie `admin_token`）で保護 |
| **API Route** | `GET /api/menu`（公開）<br>`POST /api/admin/login`, `POST /api/admin/logout`<br>`GET/POST/DELETE /api/admin/menu`, `PUT /api/admin/menu/reorder` | `/api/menu` は DB 失敗時にローカル JSON へフォールバック |
| **データベース** | Neon Postgres（`@neondatabase/serverless ^1.0.2`） | `menu (id, payload jsonb, sort_order)` テーブル 1 本・約 **73 件** |
| **環境変数（キーのみ）** | `DATABASE_URL`（または `NEON_DATABASE_URL` / `NEON_URL`）, `ADMIN_PASSWORD`, `AUTH_SECRET` | その他 `POSTGRES_*`, `PG*`, `STACK_*`, `VERCEL_OIDC_TOKEN` が `.env.development.local` に存在 |

### ⚠️ Git リポジトリ乖離の発見（重要）

調査時点で、ローカルリポジトリと Vercel 本番デプロイ元にズレがあることが判明しています。

| 項目 | ローカル作業コピー | 本番 Vercel デプロイ元 |
| :--- | :--- | :--- |
| **GitHub リポジトリ** | `MitsukaAnalysisTeam/InboundWebPage` (`origin`) | `KotaHarada02/inboundwebpage` |
| **最新コミット** | `c5dc206`（2026-06-04） | `454cb24`（2026-11-17） |
| **主な差分** | 6月時点のコード | UI リデザイン、コンポーネント分割、RSC CVE セキュリティパッチ等 |

> [!CAUTION]
> 古い `c5dc206` のまま移行すると本番の 2026-11-17 更新が先祖返りします。**Phase 0 で必ず最新コミットを取得してから作業を開始してください。**

---

## 2. 実測トラフィックデータ

### 2-1. `InboundWebPage` 側（Vercel Hobby / 実測）

* **Web Analytics（直近 30 日間: 2026-10-21 〜 2026-11-20）** ※Hobby プランの最大取得範囲
  * **訪問者数 (Visitors)**: **54 人 / 30 日**（平均 **1.8 人/日**、日別ピーク: 11/2 の **9 人**）
  * **ページビュー (Pageviews)**: **109 PV / 30 日**（平均 **3.6 PV/日**、日別ピーク: 11/17 の **24 PV** ※デプロイ確認日）
  * **パス別内訳**:
    * `/` : **69 PV**（48 人）
    * `/menu` : **21 PV**（12 人）← クライアントから `/api/menu`（DB 参照）を呼ぶ主要ページ
    * `/access` : **8 PV**（7 人）
    * `/food-and-drinks` : **7 PV**（4 人）
    * `/events` : **1 PV**（1 人）
    * `/admin/login` : **1 PV**（1 人）
    * 404（`/contact-us`, `/contact.html`）: 各 **1 PV**
* **デプロイ・ビルド実績**: 過去 1 年間で計 **11 回**（1 ビルド **41〜66 秒**）

### 2-2. Cloudflare 側（`akishika_app` 同一アカウント / 実測）

* **アカウント情報**: `Mitsukabose.system@gmail.com's Account`（Account ID: `96dc0d345a3061736d1f32cd12135662` / 2026-11-05 作成 / Zone プランは Free）
* **計測期間**: 2026-11-17 本格稼働開始 〜 2026-11-20（約 3.5 日分）
* **Workers（稼働 6 スクリプト: `akishika-front`, `akishika-user-api`, `akishika-manage-api` + 各 `-staging`）**
  * リクエスト総数（期間計）: SQL 集計（`sampleInterval` 補正）**15,973 req** / GraphQL 集計 **4,410 req**
  * 日別ピーク: 11/19 の **8,339 req/日**（SQL 集計・うち `akishika-front` 8,258 + `akishika-user-api` 81）/ GraphQL 集計ピーク **2,040 req/日**（11/17）
  * Pages Functions: **0 req**（未使用）
  * **CPU 時間（P99）**: `akishika-front` 最大 **3.99 ms**、`akishika-user-api` 最大 **10.15 ms**（staging 最大 12.61 ms）、`akishika-manage-api` 最大 **7.71 ms**、`errors: 0`
* **D1 データベース（2 DB 稼働）**
  * 容量合計: **約 236 KB**（`189758ac-...`: 176,128 bytes / `2242bbef-...`: 65,536 bytes）
  * 読込・書込ピーク（11/17 初期投入日）: 読込 **7,681 行/日**・書込 **3,847 行/日**
  * 通常日（11/18〜11/19）: 読込 **258〜904 行/日**・書込 **0〜17 行/日**
* **R2 ストレージ（2 バケット: `akishika-assets`, `akishika-assets-dev`）**
  * 容量合計: **約 116.5 MB**（各 47 オブジェクト / 61,098,350 bytes ≒ 58.3 MB）
  * 操作数（期間計）: Class A **172 回**、Class B **705 回**
* **HTTP トラフィック / WAF（`mitsukabose-app.com`）**
  * 日別ピーク（11/19）: **2,788 req/日**（うち **31 req** を `block`、11/17 は 2,223 req 中 **148 req** を `block`）
* **Images / KV / Durable Objects**: すべて実測 **0**

---

## 3. Cloudflare 無料枠 vs 2 アプリ合算試算

Cloudflare の無料枠は**アカウント単位で共有**されます。両アプリを合算した場合の消化率は以下の通りです。

| サービス / 指標 | Cloudflare Free 上限（アカウント共有） | `akishika_app` 実測 | `InboundWebPage` 想定（Vercel 実測ベース） | 合算消化率 | 判定 |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Workers リクエスト**（SSR / API） | **100,000 req / 日** | ピーク **2,040〜8,339 req/日** | 平均 **3.6 PV/日**（Bot/API 込みでも数百 req/日） | **< 10%** | ✅ 無料枠内 |
| **Workers CPU 時間** | **10 ms / リクエスト** | `akishika-user-api` P99 **10.15 ms** | Static Assets 配信中心なら **0〜3 ms** | 注意必要 | ⚠️ 要静的配信優先設計 |
| **Workers バンドルサイズ** | **64 MiB（非圧縮）** | 数百 KB | `vinext` / OpenNext バンドル（約 10〜25 MiB） | **~20–40%** | ✅ 無料枠内 |
| **Static Assets** | **リクエスト・帯域 無制限**<br>（20,000 ファイル / 25 MiB/file） | — | 画像圧縮後 **約 70 ファイル / ≤ 10 MB**（単体 ≤ 500 KB） | **0.4%** | ✅ 余裕で無料 |
| **Workers Builds** | **3,000 分 / 月**（同時 1 ビルド） | デプロイ時のみ | 年 11 回（1 回 1 分未満、月 10 分未満） | **< 1%** | ✅ 余裕で無料 |
| **D1 データベース**（※Stage 2 移行時） | **5 GB** / **10 DB**<br>読込 **500万行/日** / 書込 **10万行/日** | 2 DB / 236 KB<br>通常 <1,000 行読・<20 行書/日 | 1 DB / 数十 KB（73 件）<br>`/menu` 21 PV/30日 | **DB 30%**<br>**容量/行数 < 0.2%** | ✅ 余裕で無料 |
| **R2 ストレージ** | **10 GB** / Class A 100万/月 / Class B 1,000万/月 | 2 バケット / 116.5 MB | Static Assets 同梱のため **0 MB（R2 不要）** | **~1.1%** | ✅ 余裕で無料 |
| **Image Transformations** | **5,000 ユニーク変換 / 月** | 0 | **0**（事前圧縮 ＋ `unoptimized: true`） | **0%** | ✅ 余裕で無料 |
| **Web Analytics / DNS / WAF** | **無料**（PV 無制限・Bot Fight Mode） | `mitsukabose-app.com` | `mitsukabose.jp` を追加 | — | ✅ 完全無料 |

---

## 4. 画像・アセットおよびコード監査結果

### 4-1. `public/images/` の肥大化状況（要圧縮）

ローカルリポジトリ `public/images/` の実測結果：

* **ラスター画像合計**: **72 ファイル / 58.85 MB**
* **500 KB 超え**: **28 ファイル**（うち **1 MB 超え: 17 ファイル**）
* **主な巨大ファイル（実測値）**:

| ファイルパス | 現在サイズ | 解像度 (px) | 主な用途 |
| :--- | :---: | :---: | :--- |
| `public/images/hero/0303_1N0A1489.jpg` | **5.19 MB** | 3500 × 2333 | Hero スライドショー |
| `public/images/hero/0031_1N0A0880.jpg` | **4.39 MB** | 3500 × 2333 | Hero スライドショー |
| `public/images/hero/0054_1N0A0937.jpg` | **3.77 MB** | 3500 × 2333 | Hero スライドショー |
| `public/images/food-and-drinks/orize-brewing.png` | **3.68 MB** | 2048 × 1365 | フード＆ドリンク紹介（※PNG 非効率圧縮） |
| `public/images/menu/draft-regular.jpg` | **3.55 MB** | 3500 × 2333 | メニュー（ビール） |
| `public/images/menu/draft-seasonal.jpg` | **3.55 MB** | 3500 × 2333 | メニュー（ビール） |
| `public/images/hero/0138_1N0A1102.jpg` | **3.36 MB** | 2333 × 3500 | Hero スライドショー（縦長） |
| `public/images/hero/多酸酵母山田錦_4_3.jpg` | **2.34 MB** | 3024 × 4032 | Hero スライドショー（日本語ファイル名） |
| `public/images/food-and-drinks/mitsukabose-food.jpg` | **1.58 MB** | 2048 × 1334 | フード紹介 |
| `public/images/menu/japanese-white-no9-barrel.jpg` | **1.45 MB** | 3227 × 3227 | メニュー（ビール） |
| `public/images/menu/burnt-shrimp-miso-ramen.jpg` 〜 `vege-board.jpg`（7点） | **1.1 〜 1.3 MB** | 2048 × 1364 等 | メニュー写真 |

> [!WARNING]
> **なぜ事前画像圧縮が必須か**
> これまで Vercel の `/_next/image` がブラウザ向けに自動リサイズ・圧縮していました。Cloudflare Workers 無料枠へ移行する際、Image Transformations 月 5,000 回枠の消費や動的処理による CPU 消費をゼロにするため `images: { unoptimized: true }` を採用します。**未圧縮のまま配信するとトップページ表示だけで約 19 MB の画像をクライアントへ送信することになり、モバイル表示速度と Core Web Vitals が著しく悪化します。**

### 4-2. 監査で見つかった参照切れ・重複・設定課題

| 分類 | 対象箇所 | 内容 |
| :--- | :--- | :--- |
| **参照切れ画像（4件）** | `app/layout.tsx`, `components/seo/RestaurantJsonLd.tsx` | `/images/hero/hero-1.jpg`, `/images/hero/hero-2.jpg`, `/images/logo.png` が `public/` に存在しない（実在 Hero ファイル名が変更されたまま未追従） |
| **参照切れ背景画像** | `app/food-and-drinks/FoodAndDrinksClient.tsx`, `app/events/EventsClient.tsx` | `bg-[url('/images/food-and-drinks/japanese-pattern-dark.jpg')]` が `public/` に存在しない |
| **重複画像ファイル** | `public/images/menu/midnight-tsukemen-6.jpg` と `.jpeg` | 同一サイズ（563 KB）で拡張子違いが重複 |
| **日本語ファイル名** | `public/images/hero/多酸酵母山田錦_4_3.jpg` | URL エンコードや環境依存トラブル防止のため英数字名へのリネーム推奨（`getHeroImages.ts` 改修とセット） |
| **設定ファイル重複** | `next.config.js` と `next.config.ts` | Next.js 15 では `.ts` が優先され `.js` が無視されるため、一本化して削除が必要 |
| **Cloudflare 非互換 API** | `lib/getHeroImages.ts` | `fs.readdirSync` で `public/images/hero` を動的走査している |
| **Vercel 専用パッケージ** | `app/layout.tsx`, `app/[lang]/layout.tsx`, `package.json` | `@vercel/analytics/next` を参照している |
| **旧マルチリンガル残骸** | `app/[lang]/` | ほとんどのサブフォルダが空、`page.tsx 23-32-47-431.tsx` 等のバックアップファイルが残存（最新 `main` で整理済みか Phase 0 で要確認） |
| **ドメイン表記ゆれ** | `lib/siteConfig.ts`, `app/layout.tsx` | `SITE_URL` が `https://mitsukabose.com`、一方で Vercel 本番ドメインは `mitsukabose.jp` / `www.mitsukabose.jp` |
