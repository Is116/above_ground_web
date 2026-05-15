import { getEvents } from '@/lib/db';

export function GET() {
  return Response.json(getEvents());
}
