import { COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  return Response.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`,
      },
    }
  );
}
