"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
}

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    name: '',
    date: '',
    location: '',
    imageUrl: '',
    description: '',
  });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      console.log('Fetched events from API:', response.data);
      const sortedEvents = response.data.sort((a: Event, b: Event) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error instanceof Error ? error.message : error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchEvents();
      router.push('/admin');
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewEvent((prevEvent) => ({ ...prevEvent, date: date.toISOString().split('T')[0] }));
    }
  };

  const handleCreateOrUpdateEvent = async () => {
    try {
      console.log('Creating or updating event with data:', newEvent);
      let response;
      if (editingEventId) {
        console.log(`PUT request to /api/events/${editingEventId} with data:`, newEvent);
        response = await axios.put(`/api/events/${editingEventId}`, newEvent);
        console.log('Updated event:', response.data);
        setEditingEventId(null);
      } else {
        console.log('POST request to /api/events with data:', newEvent);
        response = await axios.post('/api/events', newEvent);
        console.log('Created event:', response.data);
      }
      setNewEvent({ name: '', date: '', location: '', imageUrl: '', description: '' });
      await fetchEvents();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error creating or updating event:', error.response?.data || error.message);
      } else {
        console.error('Error creating or updating event:', error instanceof Error ? error.message : error);
      }
    }
  };

  const handleEditEvent = (event: Event) => {
    console.log('Editing event:', event);
    setNewEvent({
      name: event.name || '',
      date: event.date || '',
      location: event.location || '',
      imageUrl: event.imageUrl || '',
      description: event.description || '',
    });
    setEditingEventId(event.id);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      console.log('Deleting event with id:', id);
      await axios.delete(`/api/events/${id}`);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error instanceof Error ? error.message : error);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <button onClick={() => signOut({ callbackUrl: '/' })} className="bg-red-500 text-white p-2 rounded mb-4">
        Log Out
      </button>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {editingEventId ? 'Edit Event' : 'Create New Event'}
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <DatePicker
          selected={newEvent.date ? new Date(newEvent.date) : null}
          onChange={handleDateChange}
          className="border p-2 mb-2 w-full"
          placeholderText="Event Date"
        />
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={newEvent.location}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Event Image URL"
          value={newEvent.imageUrl}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={newEvent.description}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <button onClick={handleCreateOrUpdateEvent} className="bg-blue-500 text-white p-2 rounded">
          {editingEventId ? 'Update Event' : 'Create Event'}
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Manage Events</h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border p-4 rounded-md shadow-md flex justify-between items-start">
              <div className="flex flex-col space-y-2">
                <p className="font-semibold text-lg">{event.name}</p>
                <p className="text-gray-600">{event.date} | {event.location}</p>
                <p className="text-gray-800">{event.description}</p>
                {event.imageUrl && (
                  <Image src={event.imageUrl} alt={event.name} width={100} height={100} className="rounded-md" />
                )}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditEvent(event)} className="bg-yellow-500 text-white p-2 rounded">
                  Edit
                </button>
                <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white p-2 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}