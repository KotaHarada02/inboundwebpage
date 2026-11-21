import { NextResponse } from 'next/server';
import { NO_STORE_HEADERS } from '@/lib/cacheHeaders';

export async function POST() {
  const response = NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  
  // Cookie削除
  response.cookies.delete('admin_token');
  
  return response;
}
