import { getEventBySlug } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(event);
}
