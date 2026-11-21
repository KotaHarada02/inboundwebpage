import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { IMMUTABLE_CACHE_CONTROL, NO_STORE_HEADERS } from '@/lib/cacheHeaders';
import {
  MAX_MENU_IMAGE_BYTES,
  MEDIA_URL_PREFIX,
  MENU_IMAGE_TYPES,
  buildMenuImageKey,
  isValidMenuItemId,
} from '@/lib/menuImages';

// 認証は middleware（/api/admin/*）で行う
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const itemId = form.get('itemId');

    if (typeof itemId !== 'string' || !isValidMenuItemId(itemId)) {
      return NextResponse.json({ error: 'Invalid item id' }, { status: 400, headers: NO_STORE_HEADERS });
    }
    if (!(file instanceof File) || !(file.type in MENU_IMAGE_TYPES)) {
      return NextResponse.json({ error: 'JPEG / PNG / WebP の画像を選んでください' }, { status: 400, headers: NO_STORE_HEADERS });
    }
    if (file.size > MAX_MENU_IMAGE_BYTES) {
      return NextResponse.json({ error: '画像が大きすぎます（5 MB まで）' }, { status: 413, headers: NO_STORE_HEADERS });
    }

    const key = buildMenuImageKey(itemId, file.type);
    await env.MENU_IMAGES.put(key, file.stream(), {
      httpMetadata: { contentType: file.type, cacheControl: IMMUTABLE_CACHE_CONTROL },
    });

    return NextResponse.json({ imageUrl: `${MEDIA_URL_PREFIX}${key}` }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to upload menu image', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
