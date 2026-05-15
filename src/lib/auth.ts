import { createHmac } from 'crypto';

export const COOKIE_NAME = 'admin_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret-ag-2026';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'aboveground';

export function createToken(): string {
  return createHmac('sha256', SECRET).update(ADMIN_PASSWORD).digest('hex');
}

export function verifyToken(token: string): boolean {
  return token === createToken();
}

export const COOKIE_OPTS = `Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
