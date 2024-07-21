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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('PUT request received with params:', params);
    const { name, date, location, imageUrl, description } = await request.json() as Omit<Event, 'id'>;
    console.log('Event data received:', { name, date, location, imageUrl, description });

    const event: Event = { id: params.id, name, date, location, imageUrl, description };
    const serializedEvent = JSON.stringify(event);

    const events = await redis.lrange('events', 0, -1);
    console.log('Current events from Redis:', events);

    const updatedEvents = events.map(eventStr => {
      let existingEvent;
      try {
        existingEvent = typeof eventStr === 'string' ? JSON.parse(eventStr) : eventStr;
        if (existingEvent.id === params.id) {
          console.log('Updating event:', existingEvent, 'to', event);
          return serializedEvent;
        }
      } catch (parseError) {
        console.error('Error parsing event from Redis:', parseError);
        return eventStr;
      }
      return eventStr;
    });

    console.log('Updated events list before saving:', updatedEvents);
    await redis.del('events');
    await redis.rpush('events', ...updatedEvents);

    const eventsAfterUpdate = await redis.lrange('events', 0, -1);
    console.log('Events from Redis after update:', eventsAfterUpdate);

    // Verify the updated event
    const updatedEventStr = eventsAfterUpdate.find(eventStr => {
      let existingEvent;
      try {
        existingEvent = typeof eventStr === 'string' ? JSON.parse(eventStr) : eventStr;
        return existingEvent.id === params.id;
      } catch (parseError) {
        console.error('Error parsing updated event from Redis:', parseError);
        return false;
      }
    });

    const updatedEvent = updatedEventStr ? (typeof updatedEventStr === 'string' ? JSON.parse(updatedEventStr) : updatedEventStr) : null;
    console.log('Updated event from Redis:', updatedEvent);

    if (!updatedEvent) {
      throw new Error('Event update failed');
    }

    console.log('Event successfully updated:', serializedEvent);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('DELETE request received with params:', params);

    const events = await redis.lrange('events', 0, -1);
    console.log('Current events from Redis:', events);

    const updatedEvents = events.filter(eventStr => {
      try {
        const existingEvent = typeof eventStr === 'string' ? JSON.parse(eventStr) : eventStr;
        return existingEvent.id !== params.id;
      } catch (parseError) {
        console.error('Error parsing event from Redis:', parseError);
        return true; // Keep the event if parsing fails
      }
    });

    console.log('Updated events after deletion:', updatedEvents);
    await redis.del('events');
    await redis.rpush('events', ...updatedEvents);

    const eventsAfterDeletion = await redis.lrange('events', 0, -1);
    console.log('Events from Redis after deletion:', eventsAfterDeletion);

    console.log('Event successfully deleted with id:', params.id);
    return NextResponse.json({ id: params.id });
  } catch (error) {
    console.error('Error deleting event:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}
