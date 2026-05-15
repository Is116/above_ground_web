import { getMarqueeItems } from '@/lib/db';

export function GET() {
  return Response.json(getMarqueeItems());
}
