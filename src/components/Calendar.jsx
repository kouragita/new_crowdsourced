import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCalendar from 'react-calendar';
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
  FaShare,
  FaBars,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (isMobile) {
      setIsSidebarOpen(false);
    }
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
            {dayEvents.slice(0, isMobile ? 1 : 2).map((event, index) => (
              <div
                key={index}
                className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full`}
                style={{ backgroundColor: event.color }}
              />
            ))}
            {dayEvents.length > (isMobile ? 1 : 2) && (
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
                +{dayEvents.length - (isMobile ? 1 : 2)}
              </div>
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 space-y-4 lg:space-y-6">
        {/* Mobile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col space-y-4"
        >
          {/* Top row - Title and Mobile Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-gray-800">
                  Learning Calendar
                </h1>
                <p className="text-sm lg:text-base text-gray-600 hidden sm:block">
                  Organize your study schedule and track learning events
                </p>
              </div>
            </div>
            
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg bg-white shadow-md border border-gray-200"
              >
                <FaBars className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                  { value: 'agenda', icon: FaList }
                ].map(viewOption => (
                  <button
                    key={viewOption.value}
                    onClick={() => setView(viewOption.value)}
                    className={`p-2 lg:p-3 transition-colors ${
                      view === viewOption.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <viewOption.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Filters Toggle */}
            <div className="sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <span>Filters & View</span>
                {showFilters ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Add Event Button */}
            <motion.button
              onClick={() => openModal()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base font-medium"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {showFilters && isMobile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
              >
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Events</option>
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                <div className="flex space-x-2">
                  {[
                    { value: 'month', icon: FaCalendarAlt, label: 'Month' },
                    { value: 'agenda', icon: FaList, label: 'Agenda' }
                  ].map(viewOption => (
                    <button
                      key={viewOption.value}
                      onClick={() => setView(viewOption.value)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
                        view === viewOption.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <viewOption.icon className="w-4 h-4" />
                      <span className="text-sm">{viewOption.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Content */}
        <div className="relative">
          <div className={`transition-all duration-300 ${isMobile && isSidebarOpen ? 'lg:grid-cols-4' : ''} ${isMobile ? '' : 'lg:grid lg:grid-cols-4 lg:gap-6'}`}>
            {/* Main Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${isMobile ? 'w-full' : 'lg:col-span-3'} bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 ${isMobile && isSidebarOpen ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {view === 'month' && (
                <div className="calendar-container">
                  <ReactCalendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    className="w-full border-none calendar-responsive"
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
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
                  {getUpcomingEvents().length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <FaCalendarAlt className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
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
                          className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <div 
                                className="w-3 h-3 lg:w-4 lg:h-4 rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: event.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm lg:text-base truncate">{event.title}</h4>
                                <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                                <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2 text-xs text-gray-500">
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
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

            {/* Sidebar - Desktop */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
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
            )}
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobile && (
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                  />
                  
                  {/* Sidebar */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto"
                  >
                    <div className="p-4 space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Events & Actions</h3>
                        <button
                          onClick={toggleSidebar}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <FaTimes className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Today's Events */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Events for {selectedDate.toLocaleDateString()}
                        </h4>
                        
                        {getEventsForDate(selectedDate).length === 0 ? (
                          <div className="text-center py-6">
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
                              <div
                                key={event.id}
                                onClick={() => openModal(event)}
                                className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                              >
                                <div className="flex items-start space-x-2">
                                  <div 
                                    className="w-3 h-3 rounded-full mt-1"
                                    style={{ backgroundColor: event.color }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-800 text-sm truncate">{event.title}</h5>
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
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => openModal()}
                            className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FaPlus className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Add Event</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                            <FaDownload className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">Export Calendar</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                            <FaShare className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">Share Calendar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}
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
                className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
                    {isEditing ? 'Edit Event' : 'Add New Event'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteEvent(eventForm.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <FaTrash className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    )}
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <FaTimes className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 lg:space-y-6">
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
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base font-medium"
                  >
                    {isEditing ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;