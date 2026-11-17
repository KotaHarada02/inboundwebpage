# 実装計画書 (`docs/site-plan.md`)

## 1. ゴールと共通制約

- **ゴール（一文）**: 「みつか坊主」のインバウンド向けWEBサイトから AI 量産テンプレート臭を完全に一掃し、蛍池駅東口徒歩1分の実店舗（白漆喰・黒鉄アーチ窓・古材テーブル・朱塗り鉢）の空気感と、時間帯別・食習慣別のお品書きを即座に確認できるサイトへ刷新する。
- **構成の要約**: Next.js 15 App Router + React 19 + Tailwind CSS v4。OKLCH 3層デザイントークン、純粋関数化したメニュー・営業時間ロジック（TDD）、SSR初期描画対応のお品書き帳UI、全ページ共通の仕込み帳（Ledger Grid）デザインシステム。
- **全作業に共通する制約（仕様からの書き写し）**:
  1. アイブロー（見出し上の全大文字小ラベル）、見出し内1語の色変え・斜体強調、意味のない連番（01/02/03）、カード内のカード、グラデーション文字、オフセットなし光彩、`transition: all`、`<Link><button>` ネストをすべて禁止する。
  2. 本文の行長は欧文 65〜75ch（和文 35〜40字）、コントラスト比は通常文字 4.5:1 以上・大文字 3:1 以上、タップ領域は 44×44px（最小でも 24×24px 以上）を守る。
  3. 事実（価格、品名、ストーリー、住所 `〒560-0032`、営業時間 `水〜土 11:30–24:00 LO 23:30 / 日 11:30–22:00 LO 21:30 / 月火定休`）を全ファイルで統一し、捏造しない。
  4. 既存の管理機能（`/admin`, `/api/admin/*`, `/api/menu`）と URL 構造を壊さない。

---

## 2. 想定外の入力・状況（エッジケース 5項目と検証箇所）

仕様が黙っているが実際の利用者が踏みそうな5つの状況と、それを押さえる作業単位・テスト：

1. **【状況1】画像ファイルが欠落している品目（73品中29品）や、長大な品名・複数サイズ価格（6段階のつけ麺など）の表示**
   - *対策とテスト*: 作業単位2の `hasMenuImage()` と `formatYenPrice()` の単体テストで検証し、作業単位5の `DishMediaFrame` で `next/image` の 400 エラーを出さずにカテゴリ別の器イラスト枠を表示する。
2. **【状況2】定休日（月・火）や営業時間外（早朝・深夜24時以降）、日曜夜（22時閉店）にアクセスした旅行者**
   - *対策とテスト*: 作業単位2の `getStoreStatus(date)` と `getDefaultTimeSlot(date)` の単体テストで「月曜昼＝定休（水曜11:30開店案内）」「水曜22:30＝Midnight営業中」「日曜22:30＝閉店（Midnight対象外）」を検証し、トップページと `/menu` に正確なステータスを出す。
3. **【状況3】「豚肉なし（No Pork）」「ヴィーガン（Vegan）」など複数の食事制限を持つ旅行者が、特定時間帯（例: Sunset）で絞り込んだ結果、該当品目が0件になる空状態（Empty State）**
   - *対策とテスト*: 作業単位2の `filterMenuItems()` 単体テストと作業単位5の `/menu` 空状態UIで、単なる空白にせず「フィルタをリセットする（Show all items in this time slot）」または「全メニューが揃う Dinner (17:30〜) を見る」の具体的な次の一手ボタンを表示する。
4. **【状況4】JavaScript 読み込み完了前・低速回線（空港ローミング直後）での `/menu` 閲覧**
   - *対策とテスト*: 作業単位5で `app/menu/page.tsx` から `initialItems` を `MenuClient` に渡し、SSR された初期HTMLの段階で全品目が描画されることをビルド出力と HTML 検査で確かめる。
5. **【状況5】320px の極小画面（iPhone SE 第1世代 / 分割画面）での複数サイズ価格表やナビゲーションのはみ出し**
   - *対策とテスト*: 作業単位1・3・5で固定幅 (`w-72` 等) に依存しないレスポンシブグリッド (`grid-cols-1 md:grid-cols-2`) と `min-w-0` / `break-words` を徹底し、横スクロールが発生しないことを検証する。

---

## 3. 縦割り作業単位（Vertical Slices）

### 作業単位1: トークン・素の要素と確認用ページ (`/styleguide`) の実装
- **受け入れ条件**:
  - `app/globals.css` に3層トークン（Primitive → Semantic → Component）が定義され、`app/layout.tsx` で `Shippori Mincho`, `Plus Jakarta Sans`, `Zen Kaku Gothic New`, `JetBrains Mono` が正しく読み込まれること。
  - `/styleguide` にアクセスすると、全カラートークン、タイポグラフィ階層、ボタン、食習慣バッジ、お品書きカード、画像未収録プレースホルダー枠が確認できること。
- **検証方法**: `npx tsc --noEmit` および `/styleguide` のレンダリング確認。
- **触るファイル**: `app/globals.css`, `app/layout.tsx`, `app/styleguide/page.tsx`, `components/ui/DishMediaFrame.tsx`

### 作業単位2: 営業状態・時間帯判定・メニュー絞り込み・価格整形の TDD 実装
- **受け入れ条件**:
  - `lib/menuUtils.ts` と `lib/existingMenuImages.ts` に、営業時間・定休日判定 (`getStoreStatus`)、時間帯自動選択 (`getDefaultTimeSlot`)、時間帯＋食習慣フィルタ (`filterMenuItems`)、`Intl.NumberFormat` による価格整形 (`formatPriceYen`)、実在画像判定 (`hasMenuImage`) が実装されていること。
  - 先に書いた単体テスト (`scripts/test-menu-utils.mjs`) が5つのエッジケースを含めすべてパスすること。
- **検証方法**: `node --test scripts/test-menu-utils.mjs`（失敗を確認してから実装し、全テスト通過を確認）。
- **触るファイル**: `lib/existingMenuImages.ts`, `lib/menuUtils.ts`, `scripts/test-menu-utils.mjs`

### 作業単位3: 店舗情報の一元化と共通ナビゲーション (`Header`, `Sidebar`, `Footer`) の刷新
- **受け入れ条件**:
  - `lib/siteConfig.ts`, `infrastructure/data/restaurant.json`, `components/seo/RestaurantJsonLd.tsx` の住所・郵便番号 (`560-0032`)・営業時間・実在する OGP 画像 (`/images/hero/0303_1N0A1489.jpg`) が完全に一致すること。
  - `Header`, `Sidebar`, `Footer` から AI 風の部分色変え (`MI-TSUKA B-OSE`)、アイブロー、`dangerouslySetInnerHTML`、不要な `/ramen` リンクが消え、`Sidebar` に `Escape` キー閉じと `role="dialog"` が実装されていること。
- **検証方法**: `npx tsc --noEmit` と grep による不整合・禁止パターンの検査。
- **触るファイル**: `lib/siteConfig.ts`, `infrastructure/data/restaurant.json`, `components/seo/RestaurantJsonLd.tsx`, `components/Header.tsx`, `components/Sidebar.tsx`, `components/ui/Footer.tsx`, `components/ui/DecorativeBackground.tsx`

### 作業単位4: トップページ (`/`) の再構築（最初の画面で営業状態・時間帯お品書き・1分アクセスを完結）
- **受け入れ条件**:
  - トップページの最初の画面で、何の店か一文で分かり、その場で時間帯（Lunch / Sunset / Dinner / Midnight）を切り替えて代表メニューと価格が見られ、駅からの1分ルートと現在の営業状態が分かること。
  - `MitsukaValuesSection` から無限ループ回転アイコン・浮遊漢字・青海波・虹色バー・01/02/03連番が消え、実店舗写真（ウォールアート、店主と五種小鉢、アーチ窓の店内）と組んだ編集記事レイアウトになっていること。
  - `AccessSection` に「伊丹空港→蛍池駅 3分 → 東口徒歩1分」の明快な経路図とタクシー/駅員提示用の日本語住所カードがあること。
- **検証方法**: `npx tsc --noEmit`, `npm run build`
- **触るファイル**: `app/page.tsx`, `components/sections/HeroSection.tsx`, `components/sections/MitsukaValuesSection.tsx`, `components/sections/AccessSection.tsx`

### 作業単位5: お品書きページ (`/menu`) の刷新（SSR初期描画・食習慣フィルタ・仕込み帳グリッド）
- **受け入れ条件**:
  - `app/menu/page.tsx` から `initialItems` を渡し、初回HTMLに全メニューが含まれること。
  - 時間帯切替（Lunch / Sunset / Dinner / Midnight）に加え、旅行者に必須の食習慣フィルタ（`All`, `Vegan / Vegetarian`, `No Pork`, `Spicy`）が動作し、0件時の空状態からワンクリックで復帰できること。
  - 29点の未収録画像で 400 エラーが出ず、`DishMediaFrame` の器図版枠が表示されること。
  - Sticky ナビが Header と重ならないこと。モーダルが `Escape` キーで閉じ、`aria-label` を持つこと。
- **検証方法**: `node --test scripts/test-menu-utils.mjs`, `npx tsc --noEmit`, `npm run build`
- **触るファイル**: `app/menu/page.tsx`, `app/menu/MenuClient.tsx`

### 作業単位6: `/food-and-drinks`・`/events`・`/access` の刷新と管理画面の lint 警告解消
- **受け入れ条件**:
  - `/food-and-drinks` と `/events` のリンク切れ背景画像 (`japanese-pattern-dark.jpg`) を撤廃し、実在する店内・醸造写真と仕込み帳レイアウトで再構築されていること。
  - `/food-and-drinks` で円マーク (`JapaneseYenIcon`) を日本酒アイコンに流用していた誤りを修正し、未収録画像のエラーを防ぐこと。
  - `/events` に店員にそのまま見せられる「店頭提示カード（Show to Staff Card — 日本語併記）」があること。
  - `/access` に駅・空港からのステップ案内と2F入口の案内が整理されていること。
  - `app/admin/page.tsx` の ESLint 警告が解消されていること。
- **検証方法**: `npm run lint`, `npx tsc --noEmit`, `npm run build`
- **触るファイル**: `app/food-and-drinks/FoodAndDrinksClient.tsx`, `app/events/EventsClient.tsx`, `app/access/AccessClient.tsx`, `app/admin/page.tsx`

### 作業単位7: フェーズ6 最終検証・技術監査の再採点と納品報告
- **受け入れ条件**:
  - 単体テスト・型検査・ESLint・本番ビルドがすべて警告・エラーなしで通ること。
  - 受け入れ条件7項目を1つずつコマンド出力で検証し、`docs/audit.md` を更新すること。
- **検証方法**: `node --test scripts/test-menu-utils.mjs && npm run lint && npx tsc --noEmit && npm run build`
- **触るファイル**: `docs/audit.md`
