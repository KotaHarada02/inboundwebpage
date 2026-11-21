import { env } from 'cloudflare:workers';
import { isValidMenuImageKey } from '@/lib/menuImages';

// R2 に保存したメニュー写真を配信する。本文は R2 からそのままストリームするので CPU はほぼ使わない。
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const key = (await params).path.join('/');
  if (!isValidMenuImageKey(key)) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.MENU_IMAGES.get(key, { onlyIf: request.headers });
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  // onlyIf の条件（If-None-Match 等）を満たさないときは本文なしのオブジェクトが返る
  if (!('body' in object)) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(object.body, { headers });
}
