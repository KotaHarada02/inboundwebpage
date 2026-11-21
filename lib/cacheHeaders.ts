// 公開 API はエッジで短期キャッシュし、Workers の起動回数と D1 への問い合わせを抑える。
export const PUBLIC_API_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
} as const;

// 管理系 API は認証済みレスポンスを含むため、いかなるキャッシュにも保存させない。
export const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store' } as const;

// アップロード画像はキーに時刻を含めて毎回別 URL にしているため、永続キャッシュしてよい。
export const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
