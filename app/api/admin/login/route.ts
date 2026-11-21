import { NextResponse } from 'next/server';
import { NO_STORE_HEADERS } from '@/lib/cacheHeaders';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expected = process.env.ADMIN_PASSWORD;

    // ADMIN_PASSWORD 未設定時に undefined === undefined でログインできてしまうのを防ぐ
    if (!expected || typeof password !== 'string' || password !== expected) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    // トークン生成
    const token = await signToken({ role: 'admin' });

    // レスポンス作成
    const response = NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });

    // Cookie設定
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 2, // 2時間
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
