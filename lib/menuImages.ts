// 管理画面からアップロードしたメニュー写真（R2 バケット mitsukabose-menu-images）の置き場所の決まり。
// R2 のキーは `menu/<itemId>-<時刻>.<ext>`、公開 URL は `/media/<キー>`。

export const MENU_IMAGE_KEY_PREFIX = 'menu/';
export const MEDIA_URL_PREFIX = '/media/';

// ブラウザ側で長辺 1200px の JPEG に縮小してから送るので、通常は数百 KB に収まる
export const MAX_MENU_IMAGE_BYTES = 5 * 1024 * 1024;

export const MENU_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const ITEM_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,99}$/;
const KEY_PATTERN = /^menu\/[a-z0-9][a-z0-9-]{0,99}-[a-z0-9]+\.(jpg|png|webp)$/;

export function isValidMenuItemId(id: string): boolean {
  return ITEM_ID_PATTERN.test(id);
}

export function isValidMenuImageKey(key: string): boolean {
  return KEY_PATTERN.test(key);
}

export function buildMenuImageKey(itemId: string, contentType: string): string {
  return `${MENU_IMAGE_KEY_PREFIX}${itemId}-${Date.now().toString(36)}.${MENU_IMAGE_TYPES[contentType]}`;
}
