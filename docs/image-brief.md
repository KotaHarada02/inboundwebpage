# 画像手配書 (`docs/image-brief.md`)

本サイトの画像資産の棚卸し結果と、今後の撮影・制作仕様を A（人が撮る本物の写真）、B（生成AIで作れる補助図版）、C（コード/SVGで今回作成した素材）の3区分で整理する。

---

## 0. 既存画像の棚卸しと今回解消した問題

1. **リンク切れしていた参照の修正（完了）**:
   - `layout.tsx` / `siteConfig.ts` / `RestaurantJsonLd.tsx` が参照していた存在しない `/images/hero/hero-1.jpg`, `/images/hero/hero-2.jpg`, `/images/logo.png` → 実在する `/images/hero/0303_1N0A1489.jpg`, `/images/hero/0054_1N0A0937.jpg`, `/images/hero/0031_1N0A0880.jpg` に修正。
   - `FoodAndDrinksClient.tsx` / `EventsClient.tsx` が参照していた存在しない `/images/food-and-drinks/japanese-pattern-dark.jpg` → 撤廃し、実在する `/images/food-and-drinks/mitsukabose-food.jpg`（店内全景）等を活用したエディトリアルヘッダーに変更。
2. **ファイル名に日本語が含まれていたヒーロー画像の扱い**:
   - `public/images/hero/多酸酵母山田錦_4_3.jpg` は URL エンコード事故を避けるため、ヒーローでは英数字ファイル名の4枚（`0303_1N0A1489.jpg`, `0054_1N0A0937.jpg`, `0138_1N0A1102.jpg`, `0031_1N0A0880.jpg`）と `/images/menu/white-miso.jpg` を優先使用。
3. **未収録だったメニュー画像29点の扱い**:
   - 料理や飲み物は「実在を示す画像」であるため AI 生成画像で偽装せず、コード側では `DishMediaFrame` コンポーネントによりカテゴリ別の器・グラスの線画図版と `Photo in preparation` 表記を表示し、下の **「A. 人が撮る・集めるもの」** に撮影リストとして記載した。

---

## A. 人が撮る・集めるもの（実物である必要がある写真）

### A-1. 外観・入口写真の差し替え（優先度：高）

| 番号 | 使う場所 | 現状の課題と撮影指示 |
|---|---|---|
| `access-entrance-01` | `/access` およびトップページのアクセス欄（現行 `/images/access/store-front.jpg` の差し替え） | **現状の課題**: 現行の `store-front.jpg` にはスマホ編集アプリで入れた巨大な白い吹き出し「E n t r a n c e（縦並び）」が画像に直接焼き込まれている。<br>**何を撮るか**: エアポートセンタービル1階の暖簾・看板と2階へ上がる階段入口。文字や吹き出しを焼き込まない元写真。<br>**構図**: 横位置（4:3）と縦位置（3:4）の両方。左側の階段入口と暖簾が画面の左1/3〜中央に入り、右側の2階アーチ窓の位置関係が分かる引きの構図。<br>**光と時間帯**: 晴天または明るい曇天の午前10:30〜11:15（開店準備中で暖簾が出ている状態、ビル壁面に強い電線の影が落ちない時間帯）。<br>**比率・解像度**: 4:3（最低 1600×1200px）、WebP または JPEG。<br>**避けること**: 画像編集アプリでの文字入れ・矢印入れ、広角レンズの過度な歪み。 |

### A-2. 未撮影メニュー29点の撮影仕様（共通基準）

- **光と時間帯**: 開店前（10:00〜11:30）またはサンセット帯（15:00〜16:30）、2階アーチ窓からの自然光（サイド光〜半逆光）。蛍光灯や強いスポット照明は消し、湯気とスープの表面の艶が出るように撮る。
- **背景（地）**: 店内の古材テーブル（煤竹色の木目）または白漆喰壁。既存の `/images/menu/red-miso.jpg` の木目トーンに揃える。
- **構図**: 斜め45度（器の深さと具材の立体感が見える角度）、比率 **4:3 横位置**、被写体は中央に置き周囲に15%の余白を残す。
- **解像度・形式**: 最低 1200×900px、JPEG または WebP（ファイルサイズは1枚 250KB 以下に圧縮）。
- **避けること**: フラッシュ直当て、真上からのフラットな俯瞰のみ、彩度を上げすぎた加工フィルター。

#### 撮影が必要な29品目リスト（保存先パスと被写体）

| 番号 | カテゴリ | 品名 | 保存先ファイルパス | 撮影のポイント（器・構図） |
|---|---|---|---|---|
| `menu-ramen-01` | Ramen | Kogashi (Charred) White Miso Ramen | `public/images/menu/kogashi-white-miso.jpg` | 焦がし白味噌の香ばしい焼き目とスープの層、つくね・チャーシューが見える斜め45度 |
| `menu-ramen-02` | Ramen | Sake Kasu Ramen | `public/images/menu/sakekasu-ramen.jpg` | 秋鹿の酒粕が溶け込んだクリーミーなスープの質感と湯気 |
| `menu-ramen-03` | Ramen | Red & White Blend Miso Ramen | `public/images/menu/red-white-blend.jpg` | 赤白ブレンド味噌の色合いと中太麺を少し持ち上げた状態または鉢全体 |
| `menu-kaedama-01` | Kaedama | Seasoned Kaedama (Aedama) | `public/images/menu/aedama.jpg` | 小鉢または平皿に盛られた和え玉、香味油と薬味の艶 |
| `menu-sake-01` | JapaneseSake | Ringo (Apple) Sake Cocktail | `public/images/menu/ringo-cocktail.jpg` | グラスに入った林檎×日本酒カクテル、背後に秋鹿の瓶をぼかして配置 |
| `menu-sake-02` | JapaneseSake | Ringo Warm Sake (Atsukan) | `public/images/menu/ringo-atsukan.jpg` | 徳利と猪口（ちろり）、温かい湯気または林檎の添え |
| `menu-wine-01` | Wine | 1.8L Bottle Japanese Wine (Isshobin) | `public/images/menu/isshobin-wine.jpg` | 一升瓶ワインのボトルとワイングラス1脚を古材テーブル上で |
| `menu-wine-02` | Wine | Kamoshi Koshu | `public/images/menu/kamoshi-koshu.jpg` | オレンジがかった醸し甲州の液色が分かるグラスとボトルラベル |
| `menu-wine-03` | Wine | Wakao Vineyard | `public/images/menu/wakao-vineyard.jpg` | ボトルラベルを中心に、自然光が透けるグラスを添える |
| `menu-wine-04` | Wine | Koshu Hyaku | `public/images/menu/koshu-hyaku.jpg` | 透明感のある白ワインのグラスとボトル |
| `menu-ippin-01` | Ippin | Wagyu Beef Tendon Miso Stew | `public/images/menu/wagyu-stew.jpg` | 小鉢に盛られた和牛すじの味噌煮込み、ネギの緑を効かせる |
| `menu-ippin-02` | Ippin | Pâté de Courgette | `public/images/menu/pate-de-courgette.jpg` | 器のテクスチャとパテの断面が見える寄り構図 |
| `menu-ippin-03` | Ippin | Daytime Drinking Set (Hiru-nomi) | `public/images/menu/hiruno-mi-set.jpg` | ドリンク1杯と小鉢群を1枚のトレーまたはテーブル上に並べた全体像 |
| `menu-ippin-04` | Ippin | Today's Small Dish (Kobachi) | `public/images/menu/kobachi.jpg` | 季節の発酵小鉢1〜2品を白木の盆または古材テーブル上で |
| `menu-lunch-01` | LunchSpecial | Daytime Set (Hiru Set) | `public/images/menu/hiru-nomi-set.jpg` | 昼セットのラーメン＋小鉢またはご飯の並び |
| `menu-sunset-01` | SunsetSpecial | Sunset Fermented Veggie Plate | `public/images/menu/sunset-fermented-veg.jpg` | 夕方の西日が差すテーブルで、発酵野菜プレートとグラスビール |
| `menu-sunset-02` | SunsetSpecial | Sunset Karaage Set | `public/images/menu/sunset-karaage-set.jpg` | 揚げたての唐揚げとドリンクのセット |
| `menu-sunset-03` | SunsetSpecial | Sunset Cafe Set | `public/images/menu/sunset-cafe-set.jpg` | デザートと自家焙煎コーヒーのセット |
| `menu-sunset-04` | SunsetSpecial | Sunset Cafe Set (À la carte) | `public/images/menu/sunset-cafe-set-alacarte.jpg` | 単品カフェプレートの寄り |
| `menu-dinner-01` | DinnerSpecial | Evening Set (Yoru Set) | `public/images/menu/dinner-set.jpg` | 夜の照明の下でのラーメン＋サイドセット |
| `menu-soft-01` | SoftDrink | Craft Ginger Ale | `public/images/menu/ginger-ale.jpg` | 氷と泡が立つグラス、自然光 |
| `menu-soft-02` | SoftDrink | Toyono Cider | `public/images/menu/toyono-cider.jpg` | 豊能サイダーの瓶とグラスを並べてローカル感を出す |
| `menu-soft-03` | SoftDrink | Mineral Soda | `public/images/menu/mineral-soda.jpg` | 炭酸の気泡が見えるクリアなグラス |
| `menu-soft-04` | SoftDrink | 100% Apple Juice | `public/images/menu/apple-juice.jpg` | 琥珀色のりんごジュースが入ったグラス |
| `menu-soft-05` | SoftDrink | House Fermented Syrup Soda | `public/images/menu/house-syrup-soda.jpg` | 自家製発酵シロップの果肉とグラデーションが見えるグラス |
| `menu-soft-06` | SoftDrink | Oolong Tea | `public/images/menu/oolong-tea.jpg` | ガラスグラスに注がれた烏龍茶 |
| `menu-soft-07` | SoftDrink | House-Roasted Coffee | `public/images/menu/house-coffee.jpg` | 陶器のカップに淹れた自家焙煎コーヒー |
| `menu-dessert-01` | Dessert | Nostalgic Icecrine | `public/images/menu/ice-creme.jpg` | 器に盛られたアイスクリーム、スプーン添え |
| `menu-dessert-02` | Dessert | Today's Ice Cream / Rich Cheesecake | `public/images/menu/todays-ice.jpg` / `public/images/menu/cheesecake.jpg` | チーズケーキの断面と焼き色が見える皿盛り |

---

## B. 生成AIで人が作るもの（背景質感・抽象図版）

※ 料理・店内・人物には使用しない。印刷物や特設バナー等で背景の和紙・左官テクスチャや抽象挿絵が必要な場合のみ、以下のプロンプトをそのまま Gemini 等に貼り付けて生成する。

- **共通画風指定（全プロンプトの冒頭に付与）**:
  `Editorial Japanese craft print style, hand-troweled shikkui plaster and warm kozo washi paper texture, palette limited to warm off-white (#F6F2EA), mortar sand (#EBE4D6), charcoal sumi ink (#1A1714), and muted vermilion (#A32C1E). Flat natural daylight, tactile matte finish, no text, no logos, no human faces, no glossy 3D rendering.`

1. **`illust-fermentation-cycle`（北摂の里山・米・大豆・水の循環図版 / 16:9）**
   ```text
   Editorial Japanese craft print style, hand-troweled shikkui plaster and warm kozo washi paper texture, palette limited to warm off-white (#F6F2EA), mortar sand (#EBE4D6), charcoal sumi ink (#1A1714), and muted vermilion (#A32C1E). Flat natural daylight, tactile matte finish, no text, no logos, no human faces, no glossy 3D rendering. A quiet woodblock-inspired botanical illustration showing rice stalks from Nose mountains, soybeans, cedar wooden miso barrel hoops, and mountain stream ripples arranged in a balanced horizontal composition with generous off-white negative space on the left side. Aspect ratio 16:9.
   ```

---

## C. 自分で作るもの（今回コード・SVGとして実装済みの素材）

1. **`DishMediaFrame`（カテゴリ別・器の線画SVG図版）**:
   - `components/ui/DishMediaFrame.tsx` にて実装。未撮影の29品目に対し、Ramen（朱塗り鉢）、JapaneseSake（徳利と猪口）、Beer/Wine（クラフトグラス）、Ippin/Special（白木盆と小鉢）、Dessert/SoftDrink（器と茶碗）の単線画SVGを `--color-text` と `--color-action` のトークンカラーで描画。
2. **伊丹空港・蛍池駅1分ルート図（Station Route Diagram）**:
   - `components/sections/AccessSection.tsx` および `app/access/AccessClient.tsx` にて、路線図サイン風のステップ図として実装。
3. **店頭・タクシー提示用札（Show-to-Staff / Driver Ledger Card）**:
   - `/events`（ステッカー・味噌サンプル受取用）および `/access`（タクシー・駅員提示用）にて、1px 二重罫線と日本語大文字表記を備えた提示カードとして実装。
