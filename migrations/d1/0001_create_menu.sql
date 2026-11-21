-- Cloudflare D1 (SQLite) 版の menu テーブル。Neon 版と同じく 1 行 = 1 メニュー項目で、
-- 項目本体は payload に JSON 文字列として持つ。
CREATE TABLE IF NOT EXISTS menu (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS menu_sort_order_idx ON menu (sort_order, id);
