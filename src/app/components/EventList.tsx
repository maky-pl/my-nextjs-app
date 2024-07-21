import { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        console.log('Fetched events from API:', response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">All Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="border p-2 mb-2">
            <div>
              <p className="font-semibold">{event.name}</p>
              <p>{event.date}</p>
              <p>{event.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
