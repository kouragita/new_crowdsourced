import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventHighlights = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Event Highlights</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong>: {event.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventHighlights;
