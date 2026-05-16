import { createShopItem } from '@/lib/db';
import type { ShopItem } from '@/lib/db';

export async function POST(request: Request) {
  const data = (await request.json()) as Omit<ShopItem, 'id'>;
  const item = await createShopItem(data);
  return Response.json(item);
}
