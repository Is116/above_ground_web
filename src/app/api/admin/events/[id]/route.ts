import { updateEvent, deleteEvent } from '@/lib/db';
import type { Event } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = (await request.json()) as Omit<Event, 'id'>;
  const result = await updateEvent(Number(id), data);
  return Response.json(result);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteEvent(Number(id));
  return Response.json({ ok: true });
}
