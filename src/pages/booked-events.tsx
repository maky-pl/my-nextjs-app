"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../app/globals.css';

interface BookedEvent {
  name: string;
  date: string;
}

export default function BookedEvents() {
  const [bookedEvents, setBookedEvents] = useState<BookedEvent[]>([]);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('bookedEvents') || '[]');
    setBookedEvents(events);
  }, []);

  const handleRemoveEvent = (index: number) => {
    const updatedEvents = bookedEvents.filter((_, i) => i !== index);
    setBookedEvents(updatedEvents);
    localStorage.setItem('bookedEvents', JSON.stringify(updatedEvents));
  };

  return (
    <div>
      <Head>
        <title>Booked Events</title>
      </Head>
      <header className="flex justify-between items-center p-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold">NORDIC ROSE</h1>
        <nav>
          <Link href="/" className="mr-4 text-blue-500">Home</Link>
          <Link href="#" className="mr-4 text-blue-500">Blog</Link>
          <Link href="#" className="mr-4 text-blue-500">About</Link>
          <Link href="#" className="mr-4 text-blue-500">Links</Link>
          <Link href="#" className="mr-4 text-blue-500">Projects</Link>
          <Link href="/booked-events" className="text-blue-500">Booked Events</Link>
        </nav>
      </header>
      <main className="p-10">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl mt-4 mb-6 font-bold">Your Booked Events</h2>
          {bookedEvents.length === 0 ? (
            <p className="mt-2 text-gray-700">No events booked yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
              {bookedEvents.map((event, index) => (
                <li key={index} className="bg-white p-4 rounded-md shadow-md border relative">
                  <p className="font-semibold text-lg">{event.name}</p>
                  <p className="text-gray-600">{event.date}</p>
                  <button
                    onClick={() => handleRemoveEvent(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
