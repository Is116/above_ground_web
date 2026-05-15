import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'admin_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret-ag-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'aboveground';

async function computeToken(): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(SECRET);
  const msgData = enc.encode(ADMIN_PASSWORD);

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await globalThis.crypto.subtle.sign('HMAC', key, msgData);
  const bytes = new Uint8Array(signature);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public admin paths through without auth
  const publicPaths = ['/admin/login', '/api/admin/login', '/api/admin/logout'];
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Check cookie
  const token = request.cookies.get(COOKIE_NAME)?.value ?? '';
  const expected = await computeToken();
  const valid = token === expected;

  if (!valid) {
    const isApiPath = pathname.startsWith('/api/admin/');
    if (isApiPath) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
