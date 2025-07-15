import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaTachometerAlt,
  FaBook,
  FaCalendarAlt,
  FaTrophy,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaSearch,
  FaUserShield,
  FaMoon,
  FaSun,
  FaHome
} from "react-icons/fa";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items configuration
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: FaTachometerAlt, 
      path: '/dashboard',
      description: 'Overview of your learning progress'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: FaUser, 
      path: '/dashboard/profile',
      description: 'Manage your personal information'
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: FaBook, 
      path: '/dashboard/courses',
      description: 'Browse and manage your courses'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: FaCalendarAlt, 
      path: '/dashboard/calendar',
      description: 'View your learning schedule'
    },
    { 
      id: 'leaderboard', 
      label: 'Leaderboard', 
      icon: FaTrophy, 
      path: '/dashboard/leaderboard',
      description: 'See top performers'
    },
  ];

  const adminMenuItem = {
    id: 'admin',
    label: 'Admin Panel',
    icon: FaUserShield,
    path: '/dashboard/admin',
    description: 'Administrative controls'
  };

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      
      if (!token || !username) {
        throw new Error("Authorization or username missing.");
      }

      // Fetch user data and role
      const [userResponse, roleResponse] = await Promise.all([
        axios.get("https://e-learn-ncux.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://e-learn-ncux.onrender.com/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const currentUser = userResponse.data.find(
        (user) => user.username === username
      );
      
      if (!currentUser) {
        throw new Error("User not found.");
      }

      const userRole = roleResponse.data.find(
        (role) => role.id === currentUser.role_id
      );

      if (userRole?.name.toLowerCase() === "admin") {
        setIsAdmin(true);
      }

      // Set user stats
      setUserStats({
        totalPoints: currentUser.total_points || 0,
        coursesCompleted: currentUser.courses_completed || 0,
        currentStreak: currentUser.current_streak || 0,
        badges: currentUser.badges || []
      });

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch user data.";
      setError(errorMsg);
      console.error("API Error:", err);
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    // Simulate fetching notifications
    setTimeout(() => {
      setNotifications([
        { id: 1, message: "New course available: Advanced React", type: "info", unread: true },
        { id: 2, message: "Congratulations! You earned a new badge", type: "success", unread: true },
      ]);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`${newDarkMode ? 'Dark' : 'Light'} mode enabled`);
  };

  // Apply dark mode on component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getActiveMenuItem = () => {
    const path = location.pathname;
    return menuItems.find(item => item.path === path) || 
           (isAdmin && adminMenuItem.path === path ? adminMenuItem : null) ||
           menuItems[0]; // Default to dashboard
  };

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="text-6xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Layout Container */}
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - Redesigned with smooth, consistent styling */}
        <motion.aside
          initial={false}
          animate={{ 
            x: window.innerWidth >= 1024 ? 0 : (isSidebarOpen ? 0 : -320) 
          }}
          className="fixed lg:relative top-0 left-0 z-50 lg:z-auto w-80 h-screen bg-white dark:bg-gray-800 shadow-xl lg:shadow-lg flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header - Smooth, no borders */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                    Student Dashboard
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back! 👋
                  </p>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* User Stats Card - Modern card design */}
            <div className="px-6 pb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">
                      {userStats.totalPoints || 0}
                    </p>
                    <p className="text-sm opacity-90">Total Points</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {userStats.currentStreak || 0}
                    </p>
                    <p className="text-sm opacity-90">Day Streak</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Menu - Clean, smooth design */}
            <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
              {[...menuItems, ...(isAdmin ? [adminMenuItem] : [])].map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActiveRoute(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                      isActiveRoute(item.path) 
                        ? 'bg-blue-100 dark:bg-blue-800/50' 
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                    }`}>
                      <item.icon 
                        className={`w-5 h-5 transition-colors ${
                          isActiveRoute(item.path) 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }`} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.label}</p>
                      <p className="text-xs opacity-75 truncate">{item.description}</p>
                    </div>
                    
                    {/* Hover arrow */}
                    <div className={`transition-all duration-200 ${
                      isActiveRoute(item.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="w-2 h-2 border-r-2 border-b-2 border-current transform rotate-[-45deg]"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Sidebar Footer - Clean action buttons */}
            <div className="p-6 space-y-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-3 w-full p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  {isDarkMode ? <FaSun className="w-5 h-5 text-yellow-500" /> : <FaMoon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                </div>
                <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <Link
                to="/"
                className="flex items-center space-x-3 w-full p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <FaHome className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <span className="font-medium">Back to Home</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <FaSignOutAlt className="w-5 h-5" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Top Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
              {/* Mobile Menu Button & Breadcrumb */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaBars size={20} />
                </button>

                {/* Breadcrumb */}
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Dashboard</span>
                    {location.pathname !== '/dashboard' && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {getActiveMenuItem()?.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Search & Actions */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:block relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                    <FaBell size={20} />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Settings */}
                <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FaCog size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-0">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;