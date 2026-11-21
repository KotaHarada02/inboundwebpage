import { NextResponse } from 'next/server';
import { NO_STORE_HEADERS } from '@/lib/cacheHeaders';
import { updateMenuSortOrder } from '@/domain/services/dbService';

export async function PUT(request: Request) {
  try {
    const body: { items: { id: string; sortOrder: number }[] } = await request.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    await updateMenuSortOrder(body.items);
    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to update sort order:', error);
    return NextResponse.json({ error: 'Failed to update sort order' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
