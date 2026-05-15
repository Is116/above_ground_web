import { getSquadMember } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const member = getSquadMember(slug);
  if (!member) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(member);
}
