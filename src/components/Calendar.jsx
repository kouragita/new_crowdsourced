import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCalendar from 'react-calendar'; // FIXED: Renamed import to avoid naming conflict
import {
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaClock,
  FaBook,
  FaUsers,
  FaVideo,
  FaMapMarkerAlt,
  FaBell,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaList,
  FaCalendarDay,
  FaCalendarWeek,
  FaSearch,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day, agenda
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);
  
  const [eventForm, setEventForm] = useState({
    id: null,
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    type: 'study',
    location: '',
    isOnline: false,
    reminderMinutes: 15,
    participants: [],
    color: '#3B82F6'
  });

  const eventTypes = [
    { value: 'study', label: 'Study Session', icon: FaBook, color: '#3B82F6' },
    { value: 'class', label: 'Live Class', icon: FaVideo, color: '#10B981' },
    { value: 'exam', label: 'Exam', icon: FaEdit, color: '#EF4444' },
    { value: 'meeting', label: 'Meeting', icon: FaUsers, color: '#8B5CF6' },
    { value: 'deadline', label: 'Assignment Deadline', icon: FaClock, color: '#F59E0B' },
    { value: 'break', label: 'Break', icon: FaCalendarAlt, color: '#6B7280' }
  ];

  // Sample events
  useEffect(() => {
    const sampleEvents = [
      {
        id: 1,
        title: 'React Advanced Concepts',
        description: 'Deep dive into React hooks and context',
        date: new Date(2024, 11, 15),
        startTime: '10:00',
        endTime: '12:00',
        type: 'study',
        location: 'Study Room A',
        isOnline: false,
        reminderMinutes: 15,
        participants: ['John Doe', 'Jane Smith'],
        color: '#3B82F6'
      },
      {
        id: 2,
        title: 'JavaScript Quiz',
        description: 'Weekly JavaScript assessment',
        date: new Date(2024, 11, 18),
        startTime: '14:00',
        endTime: '15:30',
        type: 'exam',
        location: 'Online',
        isOnline: true,
        reminderMinutes: 30,
        participants: [],
        color: '#EF4444'
      },
      {
        id: 3,
        title: 'Study Group Meeting',
        description: 'Weekly study group discussion',
        date: new Date(2024, 11, 20),
        startTime: '16:00',
        endTime: '18:00',
        type: 'meeting',
        location: 'Library',
        isOnline: false,
        reminderMinutes: 15,
        participants: ['Alice Johnson', 'Bob Wilson'],
        color: '#8B5CF6'
      }
    ];
    
    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  // Filter events based on search and type
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType]);

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventForm(event);
      setIsEditing(true);
    } else {
      setSelectedEvent(null);
      setEventForm({
        id: null,
        title: '',
        description: '',
        date: selectedDate,
        startTime: '',
        endTime: '',
        type: 'study',
        location: '',
        isOnline: false,
        reminderMinutes: 15,
        participants: [],
        color: '#3B82F6'
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.startTime) {
      toast.error('Please fill in required fields');
      return;
    }

    const eventData = {
      ...eventForm,
      id: eventForm.id || Date.now(),
      color: eventTypes.find(type => type.value === eventForm.type)?.color || '#3B82F6'
    };

    if (isEditing) {
      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? eventData : event
      ));
      toast.success('Event updated successfully!');
    } else {
      setEvents(prev => [...prev, eventData]);
      toast.success('Event created successfully!');
    }

    closeModal();
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
    closeModal();
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 mt-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: event.color }}
              />
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredEvents
      .filter(event => event.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  };

  return (
    <div className="h-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center">
            <FaCalendarAlt className="w-6 h-6 mr-3 text-blue-600" />
            Learning Calendar
          </h1>
          <p className="text-gray-600 mt-1">
            Organize your study schedule and track learning events
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* View Options */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {[
              { value: 'month', icon: FaCalendarAlt },
              { value: 'week', icon: FaCalendarWeek },
              { value: 'day', icon: FaCalendarDay },
              { value: 'agenda', icon: FaList }
            ].map(viewOption => (
              <button
                key={viewOption.value}
                onClick={() => setView(viewOption.value)}
                className={`p-2 transition-colors ${
                  view === viewOption.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <viewOption.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Add Event Button */}
          <motion.button
            onClick={() => openModal()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Event</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          {view === 'month' && (
            <div className="calendar-container">
              <ReactCalendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="w-full border-none"
                tileClassName={({ date }) => {
                  const dayEvents = getEventsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  
                  let classes = 'hover:bg-blue-50 transition-colors duration-200 ';
                  
                  if (isToday) classes += 'bg-blue-100 text-blue-800 font-semibold ';
                  if (isSelected) classes += 'bg-blue-600 text-white ';
                  if (dayEvents.length > 0) classes += 'border-l-4 border-blue-500 ';
                  
                  return classes;
                }}
              />
            </div>
          )}

          {view === 'agenda' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
              {getUpcomingEvents().length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getUpcomingEvents().map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => openModal(event)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full mt-1"
                            style={{ backgroundColor: event.color }}
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <FaCalendarAlt className="w-3 h-3 mr-1" />
                                {event.date.toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <FaClock className="w-3 h-3 mr-1" />
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </span>
                              {event.location && (
                                <span className="flex items-center">
                                  <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          eventTypes.find(type => type.value === event.type)?.value === 'exam' ? 'bg-red-100 text-red-700' :
                          eventTypes.find(type => type.value === event.type)?.value === 'class' ? 'bg-green-100 text-green-700' :
                          eventTypes.find(type => type.value === event.type)?.value === 'meeting' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {eventTypes.find(type => type.value === event.type)?.label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Mini Calendar */}
          {showMiniCalendar && view !== 'month' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Mini Calendar</h3>
                <button
                  onClick={() => setShowMiniCalendar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              <ReactCalendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full border-none text-sm"
                showNavigation={true}
                tileClassName={({ date }) => {
                  const dayEvents = getEventsForDate(date);
                  return dayEvents.length > 0 ? 'bg-blue-100' : '';
                }}
              />
            </div>
          )}

          {/* Today's Events */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              Events for {selectedDate.toLocaleDateString()}
            </h3>
            
            {getEventsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <FaCalendarDay className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No events today</p>
                <button
                  onClick={() => openModal()}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add an event
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openModal(event)}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full mt-1"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm truncate">{event.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => openModal()}
                className="w-full flex items-center space-x-2 p-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaPlus className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Add Event</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <FaDownload className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Export Calendar</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <FaShare className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">Share Calendar</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isEditing ? 'Edit Event' : 'Add New Event'}
                </h3>
                <div className="flex items-center space-x-2">
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteEvent(eventForm.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={eventForm.date.toISOString().split('T')[0]}
                      onChange={(e) => setEventForm(prev => ({ ...prev, date: new Date(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      name="type"
                      value={eventForm.type}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={eventForm.startTime}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={eventForm.endTime}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location or leave empty for online"
                  />
                </div>

                {/* Online Event */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    name="isOnline"
                    checked={eventForm.isOnline}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isOnline" className="text-sm text-gray-700">
                    This is an online event
                  </label>
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder
                  </label>
                  <select
                    name="reminderMinutes"
                    value={eventForm.reminderMinutes}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>No reminder</option>
                    <option value={5}>5 minutes before</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none !important;
          font-family: inherit;
        }
        
        .react-calendar__tile {
          max-width: none !important;
          padding: 0.75rem 0.5rem !important;
          background: none !important;
          border: none !important;
          font-size: 0.875rem !important;
          position: relative;
        }
        
        .react-calendar__tile:enabled:hover {
          background-color: #dbeafe !important;
        }
        
        .react-calendar__tile--now {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600 !important;
        }
        
        .react-calendar__tile--active {
          background-color: #2563eb !important;
          color: white !important;
        }
        
        .react-calendar__month-view__weekdays {
          font-weight: 600 !important;
          color: #4b5563 !important;
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
        }
        
        .react-calendar__navigation button {
          color: #374151 !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
        }
        
        .react-calendar__navigation button:enabled:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
};

export default Calendar;