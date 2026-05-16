import { createSquadMember } from '@/lib/db';
import type { SquadMember } from '@/lib/db';

export async function POST(request: Request) {
  const data = (await request.json()) as Omit<SquadMember, 'id'>;
  const member = await createSquadMember(data);
  return Response.json(member);
}
