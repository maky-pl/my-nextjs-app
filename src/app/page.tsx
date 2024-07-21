"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Fetch events when the component mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        console.log('Fetched events from API:', response.data);
        const sortedEvents = response.data.sort((a: Event, b: Event) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, []);

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterEvents(query);
  };

  // Filter events based on search query
  const filterEvents = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(lowercasedQuery) ||
      event.location.toLowerCase().includes(lowercasedQuery) ||
      event.description.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredEvents(filtered);
  };

  const handleBookEvent = (event: Event) => {
    const bookedEvents = JSON.parse(localStorage.getItem('bookedEvents') || '[]');
    bookedEvents.push({ name: event.name, date: event.date });
    localStorage.setItem('bookedEvents', JSON.stringify(bookedEvents));
    alert(`Event "${event.name}" booked successfully!`);
  };

  return (
    <div>
      <Head>
        <title>Nordic Rose</title>
      </Head>
      <header className="flex justify-between items-center p-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold">NORDIC ROSE</h1>
        <nav>
          <Link href="#" className="mr-4 text-blue-500">Blog</Link>
          <Link href="#" className="mr-4 text-blue-500">About</Link>
          <Link href="#" className="mr-4 text-blue-500">Links</Link>
          <Link href="#" className="mr-4 text-blue-500">Projects</Link>
          <Link href="/booked-events">Booked Events</Link>
        </nav>
      </header>
      <main className="p-10">
        <div className="flex flex-col items-center">
          <Image src="https://static.imoney.my/articles/wp-content/uploads/2023/06/19235349/buy-concert-tickets.jpg" alt="Event" width={400} height={200} />
          <h2 className="text-2xl mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p className="mt-2">Quasi, vero, quidem ut commodi aspernatur aut in eius maxime non quas.</p>
        </div>
        <h3 className="mt-10 text-3xl font-bold text-center">Upcoming Events</h3>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="border p-2 w-full max-w-md rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <Image src={event.imageUrl} alt={event.name} width={150} height={100} />
              <h4 className="mt-2 font-bold">{event.name}</h4>
              <p className="mt-1">{event.date}</p>
              <p className="mt-1">{event.location}</p>
              <p className="mt-2">{event.description}</p>
              <button
                onClick={() => handleBookEvent(event)}
                className="mt-2 bg-blue-500 text-white p-2 rounded"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
