import { createHmac, timingSafeEqual } from 'crypto';

export const COOKIE_NAME = 'admin_session';

const SECRET = process.env.AUTH_SECRET;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function createToken(): string {
  if (!SECRET || !ADMIN_PASSWORD) throw new Error('AUTH_SECRET and ADMIN_PASSWORD are required');
  return createHmac('sha256', SECRET).update(ADMIN_PASSWORD).digest('hex');
}

export function verifyToken(token: string): boolean {
  const expected = createToken();
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
}

const isProduction = process.env.NODE_ENV === 'production';
export const COOKIE_OPTS = `Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${isProduction ? '; Secure' : ''}`;
