import { ADMIN_PASSWORD, COOKIE_NAME, createToken, COOKIE_OPTS } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body as { password: string };

  if (password !== ADMIN_PASSWORD) {
    return Response.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = createToken();
  return Response.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=${token}; ${COOKIE_OPTS}`,
      },
    }
  );
}
