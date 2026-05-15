import { createEvent } from '@/lib/db';
import type { Event } from '@/lib/db';

export async function POST(request: Request) {
  const data = (await request.json()) as Omit<Event, 'id'>;
  const event = createEvent(data);
  return Response.json(event);
}
