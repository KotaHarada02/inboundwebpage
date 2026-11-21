# Phase 0〜3 実施レポート

- 実施日: 2026-11-21
- ベース: `454cb24`（vercel-prod/main、本番最新）
- 作業ブランチ: `feat/cloudflare-migration-phase1-3`（`feat/cloudflare-migration` から分岐した worktree `.claude/worktrees/cf-phase1-3`）
- push・Cloudflare デプロイ・シークレット登録・DNS 変更・Vercel 操作は行っていない。

## 結論

| Phase | 結果 |
| :--- | :--- |
| 0（事前完了分＋`npm ci`） | ✅ 合格。`npm ci` で next 15.3.8 に同期 |
| 1 画像圧縮・参照修正 | ✅ 合格。58.85 MB → **7.34 MB**、最大 **333 KB**、500 KB 超 0 件 |
| 2 Cloudflare 互換改修 | ✅ 合格。`npm run lint` / `npx tsc --noEmit` / `npm run build` すべて終了コード 0 |
| 3 vinext 導入 | ✅ 合格（Node 24.22.3 に更新後）。`build:vinext` / `tsc` / `lint` / `next build` すべて 0、`dev:vinext` で全ルートのスモークテスト合格。詳細は「P3-3: Node 24 での vinext ビルドとスモークテスト」 |

Phase 3 は当初ローカル Node 23.7.0 が原因でブロックしていたが、vinext とアプリの非互換ではなかったため OpenNext には切り替えていない。Node 24.22.3 に更新したあと P3-3 を完了した。

## コミット

| SHA | 内容 |
| :--- | :--- |
| `11ffe31` | Phase 1: 画像圧縮・参照切れ修正・重複削除・日本語ファイル名リネーム |
| `9484e6e` | Phase 2: next.config 一本化・getHeroImages 静的化・@vercel/analytics 削除・キャッシュヘッダ |
| `577dad4` | セキュリティ修正: `ADMIN_PASSWORD` 未設定時に空パスワードでログインできる不具合を修正 |
| `3207be6` | Phase 3: vinext init・cloudflare.config.ts・tsconfig/ESLint/.gitignore 整備 |
| （本コミット） | README チェックボックス更新・本レポート |

## Phase 1: 画像圧縮とアセット監査

### 圧縮スクリプト

`scripts/compress-images.mjs`（`node scripts/compress-images.mjs` で dry-run、`--apply` で上書き）

- `sharp(file).rotate()` で EXIF の回転を画素に反映してから、メタデータを削除する。
- ディレクトリごとの長辺上限と品質は runbook どおり（hero 1920px/q80、menu 1200px/q78、food-and-drinks 1400px/q80、access 1200px/q80、それ以外 1200px/q80）。JPEG は mozjpeg + progressive、PNG は palette + compressionLevel 9。
- 目標サイズ（hero 400 KB、menu 200 KB、food 350 KB、access 200 KB）を超えたら、品質を 5 ずつ下げ（下限 60）、それでも超えれば長辺を 15% ずつ縮める（下限 800px）。
- 圧縮後のほうが大きい場合は上書きしない。長辺上限と目標サイズの両方を満たしているファイルは再エンコードしないので、再実行しても画質は劣化しない（再実行して変化 0% を確認済み）。
- 拡張子は変えていない（DB の `imageUrl` は無修正のまま有効）。
- `sharp@0.35.5` は devDependency に追加した。

### 結果

| 項目 | Before | After |
| :--- | ---: | ---: |
| 合計（ラスター画像） | 58.85 MB / 72 ファイル | **7.34 MB / 71 ファイル**（-87.5%） |
| 最大ファイル | 5.19 MB（hero/0303） | **333 KB**（food-and-drinks/orize-brewing.png） |
| 500 KB 超 | 28 ファイル | **0 ファイル** |

サイズ上位: `orize-brewing.png` 333 KB、`hero/0303_1N0A1489.jpg` 264 KB、`hero/akishika-tasankoubo.jpg` 230 KB、`hero/0054_1N0A0937.jpg` 215 KB、`hero/0031_1N0A0880.jpg` 200 KB。

縦長の画像（`hero/0138`、`hero/akishika-tasankoubo`、`access/store-front`）は目視で確認し、向きが崩れていないことを確かめた。

`orize-brewing.png`: コード・JSON・DB のどこからも参照されていない（全文検索と DB 照会で確認）。そのため `.png` のまま palette PNG として最適化した（2048px → 1012px、3.68 MB → 333 KB）。JPEG 化は不要と判断した。今後ページで使う場合は、写真なので `.jpg` に変換するほうが画質面で有利。

### 参照切れ・重複の修正

| 対象 | 対応 |
| :--- | :--- |
| `/images/hero/hero-1.jpg`（`app/layout.tsx` OGP/Twitter、`lib/siteConfig.ts` `ogImage`、JSON-LD） | 実在する `hero/0054_1N0A0937.jpg`（ラーメンを持つ店主の写真、1920×1280）に置き換え。`layout.tsx` は `siteConfig.ogImage` を参照する形に統一し、OGP のサイズと alt も実画像に合わせた |
| `/images/hero/hero-2.jpg`（JSON-LD） | `hero/0303_1N0A1489.jpg`（店内で食事する客の写真）に置き換え |
| `/images/logo.png`（JSON-LD `logo`） | ロゴ画像がリポジトリにないため `logo` プロパティを削除（404 を指すより安全）。**要確認**: 正式ロゴを用意したら追加する。候補として `public/images/hero.png`（192×192 のイラスト）がある |
| `/images/food-and-drinks/japanese-pattern-dark.jpg`（`FoodAndDrinksClient.tsx`、`EventsClient.tsx`） | 画像は一度も読み込まれていなかった（404）ため、`bg-[url(...)] bg-cover bg-center` を削除。グラデーションのオーバーレイは残したので、見た目は現状と同じ |
| `menu/midnight-tsukemen-6.jpeg` | `.jpg` と内容が異なる（md5 不一致）が、DB・JSON・コードのどこからも参照されていないため削除。DB は `.jpg` を参照 |
| `hero/多酸酵母山田錦_4_3.jpg` | `hero/akishika-tasankoubo.jpg` にリネーム（`getHeroImages.ts` の静的リストと一致させた） |

### 未解決の参照切れ（データ側・残課題）

本番 Neon DB（読み取り専用の SELECT で確認、73 件）のうち **32 件（31 種類）の `imageUrl` に対応する画像ファイルがない**（例: `aedama.jpg`、`cheesecake.jpg`、`wagyu-stew.jpg`、`sunset-cafe-set.jpg` など）。どれも写真が未撮影のメニューと考えられる。`MenuItemCard` が読み込み失敗時に画像を非表示にするので、画面は崩れない。ただし `/menu` 表示時に 404 リクエストが出るほか、`MenuJsonLd` が存在しない画像 URL を出力している。これは移行前からある問題で、今回の変更による影響はない。写真を追加するか、DB の `imageUrl` を空にするかを人間が判断する必要がある（DB の更新は今回行っていない）。

逆に、DB から参照されていない menu 画像も 16 件ある（`atsuage.jpg`、`oden-3.jpg`、`yoidore-set.jpg` など）。JSON のフォールバックや今後のメニューで使う可能性があるため、削除していない。

## Phase 2: Cloudflare 互換改修

- `next.config.js` を削除し、`next.config.ts` に一本化して `images: { unoptimized: true }` を追加した（`securityHeaders` は維持）。`.js` 側の webpack JSON ルールは Next 標準の JSON import と重複していたため不要。
- `lib/getHeroImages.ts`: `fs.readdirSync` をやめ、実在する 5 ファイルの静的配列に変更（並び順は従来の `.sort()` 結果と同じ）。
- `@vercel/analytics` をアンインストールし、`app/layout.tsx` から `<Analytics />` を削除した。
- 古い残骸の `app/[lang]/` を削除した（`layout.tsx` と `page.tsx 23-32-47-431.tsx` のみで、ページはなし。`@vercel/analytics` と `getHeroImages` を参照していた）。
- キャッシュヘッダは `lib/cacheHeaders.ts` に定数としてまとめた。
  - `GET /api/menu`: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`（DB 取得時と JSON フォールバック時の両方）
  - `/api/admin/menu`、`/api/admin/menu/reorder`、`/api/admin/login`、`/api/admin/logout` の全レスポンスと、middleware が返す 401: `Cache-Control: private, no-store`
- `.eslintrc.json` に `"root": true` を追加した（worktree が親リポジトリの ESLint 設定を読み込んで競合したため。通常のチェックアウトでも影響はない）。
- 検証: `app/ components/ lib/ domain/` に `@vercel` と `fs` への依存は 0 件。`npm run lint` ✔、`npx tsc --noEmit` 0、`npm run build` 0。

**ドメイン（確認済み）**: `www.mitsukabose.jp` が本サイト（英語・インバウンド向け）、`mitsukabose.com` は日本語の公式 HP（別サイト）。`siteConfig.url` を `https://www.mitsukabose.jp` に変更し、`app/layout.tsx` の `SITE_URL` は `siteConfig.url` を参照する形にした（canonical・OGP・sitemap・robots・JSON-LD がすべて `.jp` になる）。`siteConfig.links.official`（フッターのリンク）は `https://mitsukabose.com` のまま残し、Restaurant JSON-LD の `sameAs` にも追加した。

**Tailwind のスキャン対象から `docs/` を除外**: Tailwind v4 はリポジトリ内のファイルを自動でスキャンするため、本レポート中の `bg-[url(...)]` という文字列からクラスが生成され、`npm run build` が `Can't resolve './...'` で失敗していた。`app/globals.css` に `@source not "../docs";` を追加した。

### 追加のセキュリティ修正（`577dad4`）

`/api/admin/login` は `password !== process.env.ADMIN_PASSWORD` で判定していた。そのため `ADMIN_PASSWORD` が未設定で `AUTH_SECRET` が設定済みの環境（例: Worker にシークレットを一部だけ登録した状態）では、`{}` を POST すると `undefined === undefined` が成立し、管理者トークンが発行されてしまう。`ADMIN_PASSWORD` が未設定の場合と、password が文字列でない場合は 401 を返すように修正した。

## Phase 3: vinext

### `npx vinext check`（vinext 1.4.6）

- 総合 91% compatible（supported 15 / partial 1 / issues 1）。
- partial: `images`。オプティマイザ未設定のため画像はそのまま配信される。今回の方針（事前圧縮 + unoptimized）どおり。
- issue: `__dirname` / `__filename`。該当は `scripts/*.js` と `infrastructure/data/**/*.js` の Node CLI スクリプトだけで、アプリのコードには含まれない。**致命的ではない**と判断し、vinext ルートを採用した。

### `npx vinext init --platform=cloudflare --name=mitsukabose-inbound --cdn-cache=none --data-cache=none --image-optimization=none`

init による変更:

- dependencies に `vinext@^1.4.6`、`@vinext/cloudflare@^1.4.0`、`react-server-dom-webpack` を追加し、`react` / `react-dom` を `^19.3.1` に更新
- devDependencies に `vite@^8.3.0`、`@vitejs/plugin-react`、`@vitejs/plugin-rsc`、`@cloudflare/vite-plugin@^2.0.0-rc.3`、`cf@^1.0.0-rc.2` を追加
- `package.json` に `"type": "module"` を追加し、`tailwind.config.js` を `tailwind.config.cjs` にリネーム
- `dev:vinext`（port 3001）、`build:vinext`、`start:vinext`、`deploy:vinext` スクリプトを追加
- `vite.config.ts` と `cloudflare.config.ts` を生成し、`.gitignore` に `/dist/`、`.vinext/`、`.cloudflare/` を追加

手動で整備した内容:

- `cloudflare.config.ts`
  - `accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "96dc0d345a3061736d1f32cd12135662"`
  - `compatibilityDate: "2026-11-21"`。2026-08-04 以降なので nodejs_compat は既定で有効。init はフラグを出力していない
  - `runWorkerFirst` に `!/images/*`、`!/favicon.ico`、`!/*.svg` を追加した。init の既定値は `/*` から `_next/static` だけを除外する設定で、画像リクエストも Worker を経由してしまう。追加した除外により、事前圧縮した画像は Static Assets から直接配信され、Worker の CPU とリクエスト枠を消費しない（ADR-4）
- `tsconfig.json`: `include` に `.cloudflare/types`、`exclude` に `dist` と `.vinext` を追加
- `.eslintrc.json`: `ignorePatterns` に `.cloudflare/**`、`.vinext/**`、`dist/**` を追加
- `.gitignore`: `.dev.vars*` を追加
- `"type": "module"` にすると CommonJS（`require`）のスクリプトが `node` で動かなくなるため、`scripts/*.js` 7 本と `infrastructure/data/**/*.js` 4 本を `.cjs` にリネームした。`package.json` の `sync-menu-db` と、スクリプト内の使い方コメントも更新した
- `.dev.vars`（git 管理外、権限 600）: `.env.development.local` から `DATABASE_URL`、`ADMIN_PASSWORD`、`AUTH_SECRET` の 3 キーをコピーした（値は表示していない）

### ブロッカー: `build:vinext` / `dev:vinext` がローカル Node 23.7.0 で起動しない

```
TypeError [ERR_INVALID_RETURN_PROPERTY_VALUE]: Expected a string, an ArrayBuffer, or a TypedArray
to be returned for the "source" from the "load" hook but got null.
    at load (node_modules/@cloudflare/config/dist/index.mjs:1643:11)
```

- 原因: `@cloudflare/config` は `cloudflare.config.ts` を読み込む際に `module.registerHooks` を使う。Node 23.7.0 ではビルトイン（`node:async_hooks`）に対して `nextLoad` が `source: null` を返し、それを検証エラーとして扱ってしまう（切り分けスクリプトで確認）。サポート対象の Node 系列では修正済みの挙動。
- `cf@1.0.0-rc.2` の engines は `^22.23.0 || ^24.22.0 || ^26.12.0`（`npm ci` 時に EBADENGINE 警告あり）。runbook の前提も Node `>= 22.18`。Node 23 は奇数系列で、すでに EOL。
- このマシンには Homebrew の `node 23.7.0` しか入っていない。エージェントが公式バイナリを一時ディレクトリにダウンロードする操作は権限で拒否されたため、Node の導入は人間に委ねる。

### 代替として実施したスモークテスト（Next.js サーバー、vinext ではない）

Phase 1〜2 の変更を確認するため、同じ項目を Next.js 本体で実行した。

`next start`（本番ビルド、port 3100）:

| エンドポイント | 結果 |
| :--- | :--- |
| `/`, `/menu`, `/food-and-drinks`, `/access`, `/events`, `/sitemap.xml`, `/robots.txt` | すべて 200 |
| `/ramen` | 308 → `/menu` |
| `/api/menu` | 200（73 件）、`cache-control: public, s-maxage=300, stale-while-revalidate=600` |
| `/api/admin/menu`（未認証） | 401、`cache-control: private, no-store` |
| `/admin`（未認証） | 307 → `/admin/login` |
| ページ内の `/images/...`（75 種類） | hero・OGP・access・food を含め 45 種類が 200。404 の 30 種類はすべて未撮影メニュー画像（このときのデータ源は JSON フォールバック。DB 側の 31 種類とほぼ同じ集合） |

※ `next start` は `.env.development.local` を読み込まないため、`/api/menu` は JSON フォールバック（`x-data-source: file`）になる。

`next dev`（`.env.development.local` を読み込む、port 3101）:

| 確認内容 | 結果 |
| :--- | :--- |
| `POST /api/admin/login` に `{}` | 401（修正後）、`private, no-store` |
| `POST /api/admin/login` に誤ったパスワード | 401 |
| `POST /api/admin/login` に正しいパスワード | 200、`admin_token` Cookie が発行される、`private, no-store` |
| `/api/admin/menu`（Cookie あり） | 200、73 件、`private, no-store` |
| `/admin`（Cookie あり） | 200 |
| `/api/menu` | 200、`x-data-source: db`、public キャッシュヘッダ |

最終状態での `npm run lint` ✔、`npx tsc --noEmit` 0、`npm run build`（Next）0。

## P3-3: Node 24 での vinext ビルドとスモークテスト（2026-11-21）

環境: Node 24.22.3（`brew install node@24 && brew link --overwrite node@24`）、npm 11.19.1。`npm ci` は成功した。npm 11 はインストールスクリプトを既定でブロックする（`workerd`、`sharp`、`unrs-resolver`、`fsevents`）が、ビルドと dev には影響しなかった。

### 追加で直したもの

| 問題 | 原因 | 対応 |
| :--- | :--- | :--- |
| `npx tsc --noEmit` で 3 件の型エラー | `build:vinext` が生成する `.cloudflare/types`（Workers の型）では `Response.json()` / `Request.json()` の戻り値が `unknown` になる | `app/admin/login/page.tsx`、`app/admin/page.tsx`、`app/api/admin/login/route.ts` の `json()` の受け側に型注釈を付けた |
| `dev:vinext` で `/api/menu` が JSON フォールバック、管理ログインが常に 401 | `cf/config` では、Worker に渡すシークレットを `env` に宣言しないと `.dev.vars` の値が `process.env` に入らない | `cloudflare.config.ts` の `env` に `DATABASE_URL` / `ADMIN_PASSWORD` / `AUTH_SECRET` を `bindings.secret()` として宣言した。本番では `wrangler secret put` などで登録した値がここに入る |
| `/favicon.ico` が 404 | `app/favicon.ico`（Next の規約ファイル）を vinext が配信しない。さらに `runWorkerFirst` で `/favicon.ico` を Static Assets 直配信にしているため、`public/` にないと本番でも 404 になる | `app/favicon.ico` を `public/favicon.ico` に移動した。`layout.tsx` の `icons` メタデータが `/favicon.ico` を指しているので、`<link rel="icon">` は維持される |

### スモークテスト結果（`dev:vinext`、port 3001）

| 確認内容 | 結果 |
| :--- | :--- |
| `/`, `/menu`, `/food-and-drinks`, `/access`, `/events`, `/sitemap.xml`, `/robots.txt`, `/admin/login` | すべて 200 |
| `/ramen` | 308 → `/menu` |
| `/api/menu` | 200、73 件、`x-data-source: db`、`public, s-maxage=300, stale-while-revalidate=600` |
| `/api/admin/menu`（未認証） | 401、`private, no-store` |
| `/admin`（未認証） | 307 → `/admin/login` |
| `POST /api/admin/login` に `{}` / 誤ったパスワード | どちらも 401 |
| `POST /api/admin/login` に正しいパスワード | 200、`admin_token` Cookie（HttpOnly, SameSite=Strict, 2 時間）、`private, no-store` |
| `/api/admin/menu`（Cookie あり） | 200、73 件 |
| `/admin`（Cookie あり） | 200 |
| `POST /api/admin/logout` | 200 |
| `/images/hero/*.jpg`、`/favicon.ico` | 200 |

DB への書き込み（編集・並び替え）はローカルでは試していない（本番 Neon DB を共有しているため）。Phase 4 の E2E で、ダミー編集→元に戻す手順で確認する。

### ビルド出力（`.cloudflare/output/v1/workers/default`）

| 項目 | 値 | 上限 |
| :--- | ---: | :--- |
| Worker バンドル（ソースマップ除く） | 2.13 MiB（gzip 0.63 MiB） | Free プランは**圧縮後 3 MiB**、非圧縮 64 MiB |
| Static Assets | 247 ファイル / 16 MB、最大 334 KB | 20,000 ファイル、1 ファイル 25 MiB |

`npx vinext-cloudflare deploy --dry-run` はセットアップの検証のみで、成功した（ビルドもデプロイもしない）。生成された `worker.config.json` の Worker 名は `mitsukabose-inbound`、`runWorkerFirst` の除外（`/images/*`、`/favicon.ico`、`/*.svg`）も反映されている。

`npx cf auth whoami` は `Not logged in`。Phase 4 の前に、人間が `npx cf auth login` でアカウント `96dc0d345a3061736d1f32cd12135662` にログインする必要がある（CLI が提案する `--temporary-account` デプロイは使わない）。

## Phase 4: workers.dev へのプレビューデプロイ（2026-11-21）

人間の承認を得て実施した。DNS と Vercel には触れていない。本番 DB への書き込みテストは実施していない。

- URL: https://mitsukabose-inbound.mitsukabose-system.workers.dev（Version `d6adb57f`）
- `npx vinext-cloudflare deploy` は、静的ファイルのアップロード後に「required secrets have not been set」で失敗した。`bindings.secret()` で宣言したシークレットは、新しい Worker には先に登録できないため。`npx cf deploy --secrets-file .dev.vars` でデプロイとシークレット登録を同時に行い、成功した。`cf workers secrets list` で 3 つとも `secret_text` になっていることを確認済み。
- 次回以降の更新は `npm run deploy:vinext`（シークレットは登録済みなので不要）。
- `workersDev` と `previewUrls` は未指定のため既定で有効になっている。本番切り替え後に `false` にするか検討する。

### E2E 結果（読み取りと認証）

| 確認内容 | 結果 |
| :--- | :--- |
| 公開 7 ルート、`/admin/login` | すべて 200（0.08〜0.54 秒） |
| `/ramen` | 308 → `/menu` |
| `/api/menu` | 200、73 件、`x-data-source: db`、`server: cloudflare` |
| 未認証の `/api/admin/menu` / `/admin` | 401 / 307 → `/admin/login` |
| ログイン（`{}` / 正しいパスワード）→ 管理 API → `/admin` → ログアウト | 401 / 200 → 200 → 200 → 200 |
| 画像（hero、access）、`/favicon.ico` | 200、Static Assets から配信 |
| canonical / og:url / og:image | `https://www.mitsukabose.jp` |

### ⚠️ CPU 時間が Free プランの 10 ms を超えている（P4-3 の合格基準を満たしていない）

`cf sql query`（`events.workersInvocations`）で計測した 39 件の結果は次のとおり（集計時点では `scriptName` が `__unknown__` と記録されていたが、時刻が E2E と一致する）。

- 平均 39 ms、最大 203 ms。10 ms を超えたのは 39 件中 26 件。
- 起動直後（cold start）の 3 件は 120〜200 ms（うち startup CPU が 56〜92 ms）。
- 温まった状態でも、SSR のページは 20〜120 ms。10 ms 未満に収まるのは 401/307 の応答、robots.txt、一部の API 程度。
- 現時点ではすべて `success` で、エラーは出ていない。ただし Free プランの上限は 1 リクエストあたり CPU 10 ms なので、超過が常態化すると Error 1102 で落ちるおそれがある。

公開ページを毎回 Worker で SSR していることが原因。対策の候補:
1. **公開ページを事前描画（prerender）して Static Assets から配信する**（ADR-4 の方針どおり）。`/`、`/food-and-drinks`、`/access`、`/events` は静的にできる。`/menu` は DB に依存するので、ビルド時に描画するか、ISR 相当にするか、クライアントで `/api/menu` を取得する形にするかを決める必要がある。
2. Workers Paid（月 5 ドル、CPU 上限 30 秒）に切り替える。

## CPU 対策と D1 移行（2026-11-21、Phase 4 の続き・Phase 7 前倒し）

方針: Workers Paid には切り替えない（課金しない）。DB は D1 に移す（承認済み）。

### 事前描画と HTML の縮小（`84109a3` ほか）

| 対策 | 効果 |
| :--- | :--- |
| `vite.config.ts` で `prerender: { routes: "*" }` と `cache: { cdn: staticAssetsAdapter() }`。公開ページをビルド時に描画し、Static Assets から返す | SSR が不要になる |
| `next/font` をやめ、Google Fonts を外部スタイルシートで読み込む。vinext は `@font-face` 505 個（448 KB）を全ページの HTML にインライン展開していた | `/` 528 KB → 80 KB |
| メニューのカード・バッジで繰り返されるユーティリティ列を `globals.css` のコンポーネントクラスにまとめた（中身は同じ `@apply` なので、見た目は変わらない） | `/menu` −90 KB |
| Menu JSON-LD から offer ごとの `seller` / `availability` と、項目の `description` を削除。JSON-LD はクライアントコンポーネント（`MenuClient`）で描画し、RSC ペイロードへの複製をなくした | `/menu` −160 KB |

vinext は事前描画した HTML を Worker 内で `text()` として読み込んでから返すため、CPU 時間は HTML の大きさにほぼ比例する（およそ 4 ms ＋ 20 µs/KB）。公開ページの HTML を Worker を通さず返す案は、RSC を「同じ URL に `RSC: 1` ヘッダーを付けて取得」する方式なので、クライアント側の画面遷移が壊れる。そのため採用していない。

### D1 移行

- D1 `inbound-menu-db`（`f390df9a-bb42-48a0-8ac2-572175518d38`、APAC）を作成した。スキーマは `migrations/d1/0001_create_menu.sql`（`id TEXT PK, payload TEXT(JSON), sort_order INTEGER`）。
- `npm run d1:export-from-neon` で Neon の全行を `.cloudflare/d1-menu-import.json`（git 管理外）に書き出し、`cf d1 query <id> --batch @…` で投入した。73 件の id・payload・sort_order が Neon と完全に一致することを確認済み。バッチは `DELETE FROM menu` から始まるので、何度実行しても同じ結果になる。
- `domain/services/dbService.ts` を `import { env } from "cloudflare:workers"` の `env.DB` に書き換えた（関数名と引数は同じ）。並び替えは `env.DB.batch()` で 1 トランザクションにした。
- `cloudflare.config.ts` に `DB: bindings.d1(...)` を追加し、`DATABASE_URL` の宣言を削除した。Worker のシークレット `DATABASE_URL` も削除済みで、残っているのは `ADMIN_PASSWORD` と `AUTH_SECRET` のみ。
- ローカル D1（`.cloudflare/state`）は `cf d1 query --local` に対応していないため、`dev:vinext` 起動中に Local Explorer API（`POST /cdn-cgi/local/explorer/api/d1/database/<id>/raw`）で同じバッチを投入した。
- ローカルで、作成 → 更新 → 並び替え（PUT）→ 削除 → 元に戻す、まで確認した。最終状態は初期データと一致。本番 D1 への書き込みテストはまだ。
- workers.dev で `/api/menu`（`x-data-source: db`、73 件、Neon 時代のレスポンスと完全一致）、ログイン、`/api/admin/menu` が 200 になることを確認済み。

**注意（切り替え時の再同期）**: Vercel の本番は Neon を使い続けている。DNS を切り替えるまでの間に Vercel 側の管理画面でメニューを編集すると、その変更は D1 に入らない。NS を切り替える直前に、もう一度 `npm run d1:export-from-neon` を実行し、リモート D1 にバッチを投入すること。

**注意（Next.js ビルド）**: `dbService.ts` が `cloudflare:workers` を import するため、このブランチは `next build`（Vercel）ではビルドできない。ビルドとデプロイは `build:vinext` / `deploy:vinext` で行う。

### CPU 計測（workers.dev、デプロイ直後を含む）

| ルート | HTML | 中央値 |
| :--- | ---: | ---: |
| `/` | 80 KB | 5.7〜7.9 ms |
| `/menu` | 241 KB | 9.4 ms |
| `/food-and-drinks`, `/access`, `/events` | 51〜99 KB | 4〜8 ms |
| `/api/menu` | 40 KB | Neon 14.5 ms → D1 7.0 ms |

10 ms を超えるのは主に、新しいインスタンスの初回リクエスト（20〜50 ms）。これまでの計測では、200 ms を超えたものも含めて全リクエストが `success` で、Error 1102 は出ていない。Free プランの 10 ms 上限は、1 件ごとに厳密には打ち切られていないとみられる。ただし Cloudflare は保証していないので、Phase 6 の監視で 1102 と 5xx を必ず確認する。

## P0-3: 現行 DNS レコードの控え（2026-11-21）

Vercel ダッシュボードのスクリーンショットと、公開 DNS への `dig` の結果を突き合わせた。

| 名前 | 種類 | 値 | 備考 |
| :--- | :--- | :--- | :--- |
| `mitsukabose.jp` | NS | `ns1.vercel-dns.com` / `ns2.vercel-dns.com` | レジストラ側で Cloudflare の NS に切り替える対象 |
| `mitsukabose.jp` | CAA | `0 issue "pki.goog"` | Vercel が自動管理 |
| `mitsukabose.jp` | CAA | `0 issue "sectigo.com"` | Vercel が自動管理 |
| `mitsukabose.jp` | CAA | `0 issue "letsencrypt.org"` | `dig` で確認（ダッシュボードでは「Load More」の先） |
| `*` | ALIAS | `cname.vercel-dns-017.com.` | Vercel が自動管理。apex と www を含む全サブドメインが Vercel に解決される（A: `216.198.79.65` / `64.29.17.x`） |

- **MX・TXT はなし**（apex、`_dmarc`、`*._domainkey` とも空）。このドメインではメールを使っていないので、NS を切り替えてもメールには影響しない。
- Vercel のドメイン設定: `mitsukabose.jp` → `www.mitsukabose.jp` へリダイレクト、`www.mitsukabose.jp` が本番（プロジェクト `inboundwebpage`）。
- 日本語 HP の `mitsukabose.com` は別ドメインなので、今回の NS 切り替えの対象外。

**Cloudflare に移すときの扱い**: 上のレコードはすべて Vercel への配信用なので、Cloudflare には**コピーしない**。
- ALIAS `*` は、Workers のカスタムドメイン（`www.mitsukabose.jp`、`mitsukabose.jp`）とリダイレクトルールで置き換える。
- Vercel 用の CAA（特に `sectigo.com`）は持ち込まない。Cloudflare の Universal SSL が使う認証局（Let's Encrypt、Google Trust Services、SSL.com など）を CAA で制限すると証明書を発行できなくなるおそれがあるため、CAA は設定しないでおくのが安全。
- ロールバック時は、レジストラの NS を `ns1/ns2.vercel-dns.com` に戻せば、上の状態がそのまま復元される（Vercel 側のドメイン設定を残しておくことが前提）。

## 残課題と次のアクション

1. ~~Node をサポート対象の版にする~~ → Node 24.22.3 で P3-3 完了。次は **【人間】`npx cf auth login`** のあと Phase 4（runbook パターン B）。
2. ~~`SITE_URL` のドメイン確認~~ → `https://www.mitsukabose.jp` に変更済み。
3. **【人間】JSON-LD の `logo`**: 正式ロゴ画像を配置して `RestaurantJsonLd.tsx` に追加する（候補は `public/images/hero.png`）。
4. **【人間】未撮影メニュー画像（DB 上 31 種類）**: 写真を追加するか、DB の `imageUrl` を整理する（DB の更新は Human Gate）。
5. ~~P0-3 の残り~~ → 完了。上の「P0-3: 現行 DNS レコードの控え」を参照。
6. **`--prerender` の検討**: 現在の init は prerender なしのため、公開ページも Worker の SSR を経由する。ADR-4（静的配信優先・CPU 10ms 対策）に沿って、Phase 4 の dry-run 前に `vinext init --prerender` 相当の設定と Static Assets での配信を検討する。
7. **`/api/menu` のキャッシュ**: 管理画面で更新しても、最大 5 分（stale 込みで最大 15 分）反映が遅れる。DB 障害時の JSON フォールバックも同じ時間キャッシュされる。必要なら `s-maxage` を短くする。
8. `npm audit` で 17 件の脆弱性が出ている（init 前から存在するものを含む）。今回は対応していない。
9. `middleware.ts` について vinext が Next 16 の `proxy` 規約への移行を推奨している（警告のみ）。
