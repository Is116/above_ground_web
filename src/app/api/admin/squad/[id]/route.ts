import { updateSquadMember, deleteSquadMember } from '@/lib/db';
import type { SquadMember } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = (await request.json()) as Omit<SquadMember, 'id'>;
  const result = await updateSquadMember(Number(id), data);
  return Response.json(result);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteSquadMember(Number(id));
  return Response.json({ ok: true });
}
