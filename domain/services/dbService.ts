import { env } from 'cloudflare:workers';
import { MenuItem } from '../types';

type MenuRow = { id: string; payload: string; sort_order: number | null };

/**
 * Fetch menu items from Cloudflare D1. Expects a table named `menu` with a JSON `payload`
 * column (see migrations/d1/0001_create_menu.sql). Results are ordered by sort_order ASC.
 */
export async function getMenuItemsFromDb(): Promise<MenuItem[]> {
  const { results } = await env.DB.prepare(
    'SELECT id, payload, sort_order FROM menu ORDER BY sort_order ASC, id ASC'
  ).all<MenuRow>();

  // Ensure the ID in the object matches the DB primary key to prevent duplication issues
  return results.map((r) => ({
    ...(JSON.parse(r.payload) as MenuItem),
    id: r.id,
    sortOrder: r.sort_order ?? 0,
  }));
}

/**
 * Insert or update a menu item in the database.
 */
export async function upsertMenuItem(item: MenuItem): Promise<void> {
  const payload = JSON.stringify(item);

  if (item.sortOrder !== undefined && item.sortOrder !== null) {
    await env.DB.prepare(
      `INSERT INTO menu (id, payload, sort_order) VALUES (?1, ?2, ?3)
       ON CONFLICT (id) DO UPDATE SET payload = ?2, sort_order = ?3`
    )
      .bind(item.id, payload, item.sortOrder)
      .run();
  } else {
    // For new items without a sort_order, put them at the end
    await env.DB.prepare(
      `INSERT INTO menu (id, payload, sort_order)
       VALUES (?1, ?2, COALESCE((SELECT MAX(sort_order) FROM menu), 0) + 1)
       ON CONFLICT (id) DO UPDATE SET payload = ?2`
    )
      .bind(item.id, payload)
      .run();
  }
}

/**
 * Delete a menu item from the database by ID.
 */
export async function deleteMenuItem(id: string): Promise<void> {
  await env.DB.prepare('DELETE FROM menu WHERE id = ?1').bind(id).run();
}

/**
 * Update sort_order for multiple menu items at once.
 * Accepts an array of { id, sortOrder } pairs.
 */
export async function updateMenuSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
  if (items.length === 0) return;
  // D1 runs a batch as a single transaction
  const stmt = env.DB.prepare('UPDATE menu SET sort_order = ?1 WHERE id = ?2');
  await env.DB.batch(items.map(({ id, sortOrder }) => stmt.bind(sortOrder, id)));
}
