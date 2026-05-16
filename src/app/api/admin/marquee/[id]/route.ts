import { updateMarqueeItem, deleteMarqueeItem } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text } = await req.json();
  return Response.json(await updateMarqueeItem(Number(id), text));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteMarqueeItem(Number(id));
  return Response.json({ ok: true });
}
