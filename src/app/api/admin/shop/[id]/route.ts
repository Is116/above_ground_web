import { updateShopItem, deleteShopItem } from '@/lib/db';
import type { ShopItem } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = (await request.json()) as Omit<ShopItem, 'id'>;
  const result = updateShopItem(Number(id), data);
  return Response.json(result);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteShopItem(Number(id));
  return Response.json({ ok: true });
}
