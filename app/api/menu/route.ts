import { NextResponse } from 'next/server';
import { getMenuItems } from '@/domain/services/dataService';
import { getMenuItemsFromDb } from '@/domain/services/dbService';
import { PUBLIC_API_CACHE_HEADERS } from '@/lib/cacheHeaders';

export async function GET() {
  try {
    const items = await getMenuItemsFromDb();
    console.log('Fetched menu items from DB:', items.length);
    return NextResponse.json(items, { headers: { ...PUBLIC_API_CACHE_HEADERS, 'x-data-source': 'db' } });
  } catch (err) {
    // If DB fails, fall back to the existing JSON files
    // Keep the error logged server-side for debugging
    // Note: don't expose internal error details to the client
    // eslint-disable-next-line no-console
    console.error('DB fetch failed, falling back to local JSON menu', err);
    const items = getMenuItems();
    return NextResponse.json(items, { headers: { ...PUBLIC_API_CACHE_HEADERS, 'x-data-source': 'file' } });
  }
}
