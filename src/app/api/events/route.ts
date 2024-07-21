import { NextResponse } from 'next/server';
import redis from '@/utils/redis';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
}

export async function GET() {
  try {
    console.log('Attempting to fetch events from Redis...');
    const events = await redis.lrange('events', 0, -1);
    console.log('Raw events from Redis:', events);

    const parsedEvents = events.map(event => {
      if (typeof event === 'string') {
        try {
          return JSON.parse(event);
        } catch (parseError) {
          console.error('Error parsing event:', parseError);
          return null;
        }
      }
      return event;  // If the event is already an object
    }).filter(event => event !== null);

    console.log('Parsed events:', parsedEvents);

    return NextResponse.json(parsedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, date, location, imageUrl, description } = await request.json() as Omit<Event, 'id'>;
    const event: Event = { id: Date.now().toString(), name, date, location, imageUrl, description };
    const serializedEvent = JSON.stringify(event);
    await redis.rpush('events', serializedEvent);
    console.log('Created event:', serializedEvent);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
  }
}