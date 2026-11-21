// Workers 実行時はファイルシステムを走査できないため、public/images/hero/ の実在ファイルを静的に列挙する。
// ヒーロー画像を追加・削除したらこの配列も更新すること。
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
