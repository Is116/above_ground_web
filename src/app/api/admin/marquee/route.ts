import { createMarqueeItem } from '@/lib/db';

export async function POST(req: Request) {
  const { text } = await req.json();
  return Response.json(await createMarqueeItem(text));
}
