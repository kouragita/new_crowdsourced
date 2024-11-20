import React, { useState, useEffect } from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPage = () => {
  const [events, setEvents] = useState([]); // Store events
  const [selectedDate, setSelectedDate] = useState(new Date()); // Store selected date
  const [showEventForm, setShowEventForm] = useState(false); // Show event form modal
  const [newEvent, setNewEvent] = useState({ title: "", description: "" }); // New event data

  // Load events from localStorage on initial render
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle event form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle event creation
  const handleCreateEvent = () => {
    const newEventData = { ...newEvent, date: selectedDate.toISOString() };
    const updatedEvents = [...events, newEventData];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setShowEventForm(false);
    setNewEvent({ title: "", description: "" });
  };

  // Handle event deletion
  const handleDeleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h3 className="text-3xl font-bold text-gray-800 text-center">Your Calendar</h3>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform transition-all hover:scale-105">
          <ReactCalendar
            onChange={handleDateChange}
            value={selectedDate}
            className="react-calendar shadow-lg rounded-xl"
            tileClassName="react-calendar__tile custom-tile"
          />
        </div>

        {/* Event List */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-700">Upcoming Events</h4>
          <ul className="space-y-4 mt-4">
            {events
              .filter((event) => new Date(event.date).toDateString() === selectedDate.toDateString())
              .map((event, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h5 className="font-semibold text-gray-800">{event.title}</h5>
                  <p className="text-gray-600">{event.description}</p>
                  <button
                    onClick={() => handleDeleteEvent(index)}
                    className="mt-2 p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Event Creation Form */}
        {showEventForm && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-xl transform transition-all animate__animated animate__fadeIn">
            <h5 className="text-xl font-semibold text-gray-700">Create New Event</h5>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleInputChange}
              className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={newEvent.description}
              onChange={handleInputChange}
              className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <div className="flex mt-6 justify-between">
              <button
                onClick={handleCreateEvent}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Save Event
              </button>
              <button
                onClick={() => setShowEventForm(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Button to Show/Hide Event Form */}
        {!showEventForm && (
          <button
            onClick={() => setShowEventForm(true)}
            className="text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 transition-all"
          >
            Add New Event
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;