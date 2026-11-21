import { NextResponse } from 'next/server';
import { NO_STORE_HEADERS } from '@/lib/cacheHeaders';
import { getMenuItemsFromDb, upsertMenuItem, deleteMenuItem } from '@/domain/services/dbService';
import { MenuItem } from '@/domain/types';

export async function GET() {
  try {
    const items = await getMenuItemsFromDb();
    return NextResponse.json(items, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const item: MenuItem = await request.json();
    
    // バリデーション（簡易）
    if (!item.id || !item.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    await upsertMenuItem(item);
    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to save menu item:', error);
    return NextResponse.json({ error: 'Failed to save menu item' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    await deleteMenuItem(id);
    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to delete menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
