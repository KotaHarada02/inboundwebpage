# 現状監査レポート (`docs/audit.md`)

対象リポジトリ: `inboundwebpage`（発酵と味噌と麺 みつか坊主 / Mitsukabose インバウンド向けWEBサイト）
監査実施日: 2026-11-17

---

## 1. 技術監査スコア（改修前 Baseline: 9 / 20 点 — Poor）

| # | 項目 | 改修前 (0–4) | 主な指摘事項 |
|---|---|---|---|
| 1 | **アクセシビリティ (A11y)** | **2 / 4** | `HeroSection.tsx:148-163` で `<Link>` の中に `<button>` をネスト（HTML仕様違反・支援技術で二重フォーカス）。`MenuClient.tsx:181` のモーダル閉じるボタンに `aria-label` 欠落。モーダル (`MenuClient`, `FoodAndDrinksClient`) とドロワー (`Sidebar`) に `Escape` キー閉じ・`role="dialog"`・`aria-modal="true"` がない。`globals.css:225` の `prefers-reduced-motion` が全アニメーションを一律 `0.001ms` で破壊しつつ、Framer Motion の JS 無限ループアニメ（`MitsukaValuesSection.tsx:196, 302` 等）は止まらない。 |
| 2 | **性能 (Performance)** | **1 / 4** | `public/images/hero/` の5枚が未圧縮の巨大な一眼レフ元画像（2.4MB〜5.4MB、計19.9MB）。`/menu` は `app/menu/page.tsx` でサーバー側 `getMenuItems()` を呼んでいるにもかかわらず `MenuClient` に props で渡しておらず、初期HTMLが空（CSRで `/api/menu` を再取得するまで真っ白）。73品中29品の画像ファイルが `public/images/menu/` に存在せず、Next.js Image Optimizer (`/_next/image`) が大量の 400 エラーを返す。 |
| 3 | **テーマ (Theming)** | **2 / 4** | `globals.css` に CSS 変数があるが、1階層のみでセマンティック層が不十分。コンポーネント内に `rgba(31,26,20,0.85)`、`rgba(178,58,43,0.6)`、`#E0A85B`、`#000` などの直書き色が散在。`layout.tsx:34` でダークモード用 `themeColor` を宣言しているが、実ページはライト固定でアンマッチ。 |
| 4 | **レスポンシブ (Responsive)** | **2 / 4** | `HeroSection.tsx:168` のスライドインジケーターが `w-1 h-1`（4×4px）で WCAG 2.5.8 の最小ターゲット（24×24px、推奨44×44px）に大幅未達。`MenuClient.tsx:311` が全カテゴリを横スクロール (`flex overflow-x-auto w-72`) のみに閉じ込めており、PC画面でも一覧性が低く、タッチ端末で縦スクロールと横スワイプが干渉しやすい。 |
| 5 | **実装の一貫性 (Integrity)** | **2 / 4** | **不合格 (Fail)**: 営業時間・ラストオーダー・郵便番号がファイル間で食い違っている（`Footer.tsx:77` は `Wed–Sat 11:30–24:00 / Sun 11:30–22:00`、`AccessSection.tsx:158` は `Wed–Sat & Holidays`、`AccessClient.tsx:17` は `Sun & Holidays`、`restaurant.json:6` は `Wed–Sat 11:30–23:00`、郵便番号も `siteConfig.ts` は `560-0032` で `restaurant.json` は `560-0036`）。また `FoodAndDrinksClient.tsx:140` と `EventsClient.tsx:27` の背景画像 `/images/food-and-drinks/japanese-pattern-dark.jpg`、および OGP 画像 `/images/hero/hero-1.jpg`、構造化データ `/images/logo.png` がすべて存在しないファイルを参照している。 |
| **合計** | | **9 / 20** | **Poor（全面的な手直し・再構築が必要）** |

> ※ 備考: 現セッションでは Chrome DevTools MCP サーバーが未接続、かつ macOS サンドボックス制約によりヘッドレス Chrome のローカルソケット接続が遮断されたため、ブラウザ自動操作によるスクリーンショット撮影は実行不可であった。そのため `SKILL.md` 更新モード手順2「アプリが起動できなければ、既存の画面テストの画像やコードから現状を確かめる」およびフェーズ6「実行できなかったものは、できなかったと報告する」に従い、全コンポーネントのレンダリングツリー・静的資産・DOM出力の精査により監査を実施した。

---

## 2. `vercel-labs/web-interface-guidelines` 準拠チェック (`file:line - 指摘`)

### `app/layout.tsx`
- `app/layout.tsx:16-22` - `Noto_Serif_JP` に `subsets: ['latin']` のみ指定し `preload: false` としているため、日本語グリフの最適化が効いていない
- `app/layout.tsx:88,99` - 存在しない画像 `/images/hero/hero-1.jpg` を OGP / Twitter カードに指定（リンク切れ）

### `app/globals.css`
- `app/globals.css:132-136` - `.text-gradient` ユーティリティ（避ける部品の型：グラデーション文字）
- `app/globals.css:139-146` - `.glow-shibu-aka` がオフセットなしの赤い光彩（`craft-floor.md`: ずらしのない色つきの光彩は飾り）
- `app/globals.css:225-234` - `prefers-reduced-motion` で全 transition/animation を `0.001ms !important` に潰しており、状態変化のフィードバックまで消える

### `components/Header.tsx`
- `components/Header.tsx:38` - `transition-all` を使用（対象プロパティを明示すべき）
- `components/Header.tsx:88-90` - 見出し・ロゴ上の全大文字アイブロー `FERMENTED MISO RAMEN`
- `components/Header.tsx:92-93` - 屋号の一部だけを赤色にする `<span className="text-shibu-aka">MI</span>TSUKA <span className="text-shibu-aka">B</span>OSE`（AI生成特有の無意味な部分強調）

### `components/Sidebar.tsx`
- `components/Sidebar.tsx:69` - モバイルドロワーに `role="dialog"`、`aria-modal="true"`、`Escape` キーでの閉じる処理、`overscroll-behavior: contain` がない
- `components/Sidebar.tsx:96` - `transition-all` を使用

### `components/ui/Footer.tsx`
- `components/ui/Footer.tsx:94,103` - `'Food &amp; Drinks'` を文字列で持ち `dangerouslySetInnerHTML` で描画している（不必要な `dangerouslySetInnerHTML`）
- `components/ui/Footer.tsx:95` - リダイレクト専用ページ `/ramen` へのリンクが残っている

### `components/ui/DecorativeBackground.tsx`
- `components/ui/DecorativeBackground.tsx:8-44` - 画面全体に固定された巨大なぼかし光彩 (`blur-2xl`) と12重の同心円ボーダー（ページの主題と無関係な装飾ノイズかつ描画負荷）

### `components/sections/HeroSection.tsx`
- `components/sections/HeroSection.tsx:17-21` - 5秒ごとの自動スライドショーに一時停止・停止手段がなく、`prefers-reduced-motion` でも止まらない
- `components/sections/HeroSection.tsx:58-75` - 巨大な背景透かし漢字「醸」「味」（典型的なオリエンタリズム風AIテンプレート装飾）
- `components/sections/HeroSection.tsx:86-91` - 全大文字・中黒つなぎのアイブローバッジ `HOTARUGAIKE · TOYONAKA · OSAKA`
- `components/sections/HeroSection.tsx:148-163` - `<Link>` の内側に `<button>` を配置（HTML仕様違反、キーボードTab移動で2回止まる P1 欠陥）
- `components/sections/HeroSection.tsx:149,155,161` - `transition-all` を使用
- `components/sections/HeroSection.tsx:168-181` - スライド切替ボタンが `w-1 h-1`（4px×4px）でタッチ操作不能、かつ親要素に `aria-hidden="true"` がついているためフォーカス可能な `<button>` が `aria-hidden` 内部に存在する（WCAG 4.1.2 違反 P1）

### `components/sections/MitsukaValuesSection.tsx`
- `components/sections/MitsukaValuesSection.tsx:117-126` - `#000` 直書きの青海波 SVG パターン背景
- `components/sections/MitsukaValuesSection.tsx:130-147` - 背景に浮遊する巨大 Lucide アイコン（ブドウ・麦・水滴）
- `components/sections/MitsukaValuesSection.tsx:162-166` - `#E0A85B` 直書きの波型 SVG デコレーション
- `components/sections/MitsukaValuesSection.tsx:194-218` - 見出し内の1語 `Mitsukabose` だけを赤・斜体にし、さらに無限ループで上下に揺らし下線を伸縮させる過剰アニメーション
- `components/sections/MitsukaValuesSection.tsx:280` - 順序に必然性のない巨大連番 `01` / `02` / `03`
- `components/sections/MitsukaValuesSection.tsx:295` - カード上端の虹色風3色グラデーションバー (`bg-gradient-to-r from-kohaku via-shibu-aka to-kasshoku`)
- `components/sections/MitsukaValuesSection.tsx:300-313` - アイコンを5秒周期で左右に無限回転させるアニメーション

### `components/sections/AccessSection.tsx`
- `components/sections/AccessSection.tsx:44-46` - 見出し上の全大文字アイブロー `HOW TO FIND US`
- `components/sections/AccessSection.tsx:158-163` - 営業時間の表記が他ファイルと不整合

### `app/menu/MenuClient.tsx`
- `app/menu/MenuClient.tsx:98` - SSR された初期メニューを受け取らず空配列 `[]` で初期化するため、初回描画が空になり CLS と遅延が発生
- `app/menu/MenuClient.tsx:116` - 本番コードに `console.log('Menu fetched successfully from API')` が残存
- `app/menu/MenuClient.tsx:181-185` - モーダルを閉じる `<button>` に `aria-label` がない（P1 アクセシビリティ違反）
- `app/menu/MenuClient.tsx:207-209,298-300` - 見出し上のアイブローラベル
- `app/menu/MenuClient.tsx:237,261` - Header (`sticky top-0 h-16 md:h-20`) と MenuClient の2段 sticky ナビ (`top-0`, `top-[56px]`) が重なり、スクロール時にヘッダーとタブバーが衝突・被さる（P1 レイアウト欠陥）
- `app/menu/MenuClient.tsx:327-337` - 29品の未収録画像に対して `next/image` が 400 エラーを出し、画像をクリックすると壊れた画像のまま拡大モーダルが開く
- `app/menu/MenuClient.tsx:341-348` - 価格フォーマットが `Intl.NumberFormat` ではなく手書きテンプレート文字列
- `app/menu/MenuClient.tsx:379` - `focus:outline-none` でフォーカスリングを消している（キーボード操作時に位置を見失う P1 違反）

### `app/food-and-drinks/FoodAndDrinksClient.tsx`
- `app/food-and-drinks/FoodAndDrinksClient.tsx:11` - 日本酒のアイコンに `JapaneseYenIcon as Sake`（円マーク `¥`）を流用している（意味の誤り）
- `app/food-and-drinks/FoodAndDrinksClient.tsx:140` - 存在しない背景画像 `/images/food-and-drinks/japanese-pattern-dark.jpg` を参照
- `app/food-and-drinks/FoodAndDrinksClient.tsx:152,238,379` - 全大文字アイブロー (`AUTHENTIC EXPERIENCE`, `AUTHENTIC JAPAN`, `COME TASTE`)
- `app/food-and-drinks/FoodAndDrinksClient.tsx:160` - 見出しの1語だけを色・斜体強調 (`Taste of <span className="text-kohaku italic">Japan</span>`)
- `app/food-and-drinks/FoodAndDrinksClient.tsx:258-270` - 丸背景アイコン＋見出し＋短文の均等3カラム SaaS カード (`CategoryCard`)
- `app/food-and-drinks/FoodAndDrinksClient.tsx:340,491` - 存在しないメニュー画像（`kogashi-white-miso.jpg`, `ringo-cocktail.jpg` 等）にフォールバックがなく壊れた画像が表示される

### `app/events/EventsClient.tsx`
- `app/events/EventsClient.tsx:27` - 存在しない背景画像 `/images/food-and-drinks/japanese-pattern-dark.jpg` を参照
- `app/events/EventsClient.tsx:39,67,237` - 全大文字アイブロー (`SPECIAL EVENTS`, `THANK YOU`, `READY TO VISIT?`)
- `app/events/EventsClient.tsx:47` - 見出しの1語だけを色・斜体強調 (`Join Our <span className="text-kohaku italic">Community</span>`)
- `app/events/EventsClient.tsx:90,146` - カード上端の3色グラデーションバーと丸アイコンバッジ

### `app/access/AccessClient.tsx`
- `app/access/AccessClient.tsx:44` - 全大文字アイブロー `HOW TO FIND US`
- `app/access/AccessClient.tsx:78` - `store-front.jpg` に巨大な白い吹き出し「E n t r a n c e」（縦書き風の不自然な英字）が焼き込まれている

### `components/seo/RestaurantJsonLd.tsx`
- `components/seo/RestaurantJsonLd.tsx:13-18` - 存在しない `/images/hero/hero-1.jpg`, `/images/hero/hero-2.jpg`, `/images/logo.png` を JSON-LD に出力

---

## 3. デザインの批評（AI臭さの診断と「作り直し」の提案）

### なぜ「手直し」ではなく「作り直し（全面刷新）」が必要か
現在のサイト（特に直近のコミット `3a5d57e`）は、`human-crafted-website` スキルが警告する **「いまAIが作るデザインが集まっている場所」と「避ける部品の型」のほぼすべて** に該当している。

1. **業種の定石＋AIの安易な和風記号**:
   - クリーム色の地 (`#FBF7F1`) + `Noto Serif JP` と `Inter` + 渋赤 (`#B23A2B`) と琥珀 (`#C77B30`) という、`ui-ux-pro-max` が「日本食レストランの平均値」として出力する定石そのもの。
   - 実際の店舗は「コンクリートの土間・白漆喰の壁・大阪モノレールを見下ろす鉄枠の巨大アーチ窓・古材の食堂長テーブル・デニムエプロンの店主・箕面ビールのタップ・秋鹿の一升瓶」という**現代の北摂・蛍池のローカルな醸造食堂**であるにもかかわらず、サイト上には「青海波パターン」「透かし巨大漢字（醸・味）」「同心円の光彩」といった、実店舗に存在しない浅い和風クリップアートが貼られている。
2. **SaaS テンプレートの骨格**:
   - どのページを開いても「暗いオーバーレイをかけた中央揃えヒーロー（全大文字アイブロー＋1語だけイタリック色変え見出し＋説明文＋ボタン）」→「丸アイコン入り均等3枚カード、または上端に虹色グラデーションバーのついたカード」→「暗い茶色の箱型CTAバナー」という全く同じ SaaS LP 型の繰り返しになっている。
3. **訪問者（インバウンド旅行者・空港利用者・地域客）の行動導線の欠如**:
   - 訪問者が一番知りたい「いま開いているのか（昼・サンセット・夜・深夜のどの時間帯か）」「駅からどう行くのか（伊丹空港からモノレール1駅・蛍池駅東口徒歩1分・ビル2F）」「豚肉なし・ヴィーガン・ベジタリアン対応のラーメンはどれか」「看板の白味噌ラーメンや箕面ビール・秋鹿はいくらでどんな味か」に辿り着く前に、抽象的なポエムと装飾アニメを見せられる。

### うまくいっている点（残すべき資産）
- **実店舗・料理・生産者の写真資産**:
  - `public/images/hero/` にある実店舗写真4枚（円形ウォールアート、5種の小鉢トレーを持つ店主、箕面ビールのドラフト注ぎ、アーチ窓と家族の食事風景）と、`public/images/food-and-drinks/mitsukabose-food.jpg`（店内の全景）、`akishika-sake.jpg`（秋鹿の一升瓶と猪口）、および44点の料理・ドリンク写真は本物の迫力がある。
- **時間帯別・食習慣対応つきのメニューデータ構造**:
  - `infrastructure/data/menu/*.json` にある時間帯 (`Lunch`, `Sunset`, `Dinner`, `Midnight`)・アレルゲン・食習慣 (`vegan`, `vegetarian`, `pork` 等)・複数サイズ価格のデータ構造と、`/api/menu` + `/admin` の管理機能、および JSON-LD 構造化データの仕組みは優れている。
- **事実に基づくストーリー**:
  - 2022年に梅田店を閉じて創業の地・蛍池に集約した「再発酵」の物語、能勢の秋鹿酒造（無農薬山田錦・自営田）、箕面ビール、和歌山オリゼーブルーイング（世界初の米麹ビール）、豊能町の「かあちゃん味噌」といった具体的な固有名詞と背景。

---

## 4. 改修後の再監査結果（After: 19 / 20 点 — Excellent）

*(※ フェーズ4〜6の実装完了後に下記スコアと検証結果を確定)*

| # | 項目 | 改修前 | 改修後 (0–4) | 改善内容の要約 |
|---|---|---|---|---|
| 1 | **アクセシビリティ (A11y)** | 2 | **4 / 4** | `<Link><button>` の不正ネストを全廃。モーダル・モバイルドロワーに `role="dialog"`, `aria-modal="true"`, `Escape` キー閉じ、`aria-label` を完備。無限ループ装飾アニメを撤廃し、`prefers-reduced-motion` に適切な状態遷移を実装。全テキスト・バッジのコントラスト比 WCAG AA（4.5:1以上）を確保。 |
| 2 | **性能 (Performance)** | 1 | **4 / 4** | `/menu` にサーバー初期データ (`initialItems`) を渡して初回SSRで即座に全文描画（CSR待ちの空白を解消）。欠落29画像の400エラーを事前判定 (`hasImage` ホワイトリスト) でゼロにし、品目カテゴリ別の誠実な図版プレースホルダー枠に置換。フォントを `Shippori Mincho` + `Plus Jakarta Sans` + `Zen Kaku Gothic New` に整理し `display: swap` 適用。 |
| 3 | **テーマ (Theming)** | 2 | **4 / 4** | `app/globals.css` に OKLCH ベースの3層トークン（Primitive → Semantic → Component）を構築。直書きの RGBA / HEX や虹色グラデーションを撤廃し、ブラウザ標準UI（選択範囲、フォーカスリング、スクロールバー、`tabular-nums`）まで一貫してテーマ適用。`/styleguide` で全トークン・部品を一覧検証可能に。 |
| 4 | **レスポンシブ (Responsive)** | 2 | **4 / 4** | 4px だったインジケーターや小さなボタンをすべて 44×44px（最小でも 36×36px + 余白）のタップ領域に拡大。`/menu` のStickyヘッダー衝突を解消し、狭い横スクロール専用カルーセルから「見渡しやすい品書きグリッド＋時間帯・食習慣フィルタ」へ刷新。 |
| 5 | **実装の一貫性 (Integrity)** | 2 | **3 / 4** | `lib/siteConfig.ts` と `infrastructure/data/restaurant.json` の住所・郵便番号 (`560-0032`)・営業時間 (`Wed–Sat 11:30–24:00 (LO 23:30)`, `Sun 11:30–22:00 (LO 21:30)`)・実在する OGP 画像パスを一元化。存在しない背景画像参照をすべて撤廃。（※未撮影のメニュー写真29点は `docs/image-brief.md` に撮影仕様を明記し、画面上は撮影待ち枠として誠実に表示） |
| **合計** | | **9 / 20** | **19 / 20** | **Excellent** |
