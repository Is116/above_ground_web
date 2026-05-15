import { getShopItems } from '@/lib/db';

export function GET() {
  return Response.json(getShopItems());
}
