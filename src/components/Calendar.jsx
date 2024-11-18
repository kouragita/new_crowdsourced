import React from "react";
import { Calendar as ReactCalendar } from "react-calendar"; // Rename import to avoid conflict
import "react-calendar/dist/Calendar.css"; // Don't forget to import styles for the calendar

const CalendarPage = () => {
  const handleDateChange = (date) => {
    console.log("Selected date:", date);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800">Your Calendar</h3>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <ReactCalendar onChange={handleDateChange} /> {/* Use the renamed import here */}
      </div>
    </div>
  );
};

export default CalendarPage;
