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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    setIsDarkMode(!isDarkMode);
    // Here you would typically update a global theme context
    toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode enabled`);
  };

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
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar Overlay */}
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

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        className="fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-80 h-screen bg-white lg:bg-gradient-to-b lg:from-blue-600 lg:to-blue-800 shadow-xl lg:shadow-none lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-blue-500 lg:border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 lg:text-white">
                  Student Dashboard
                </h2>
                <p className="text-sm text-gray-600 lg:text-blue-100 mt-1">
                  Welcome back! 👋
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* User Stats Card */}
          <div className="p-6 border-b border-blue-500 lg:border-blue-400">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-blue-50 lg:bg-white/10 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600 lg:text-white">
                    {userStats.totalPoints || 0}
                  </p>
                  <p className="text-xs text-gray-600 lg:text-blue-100">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 lg:text-green-300">
                    {userStats.currentStreak || 0}
                  </p>
                  <p className="text-xs text-gray-600 lg:text-blue-100">Day Streak</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {[...menuItems, ...(isAdmin ? [adminMenuItem] : [])].map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActiveRoute(item.path)
                      ? 'bg-blue-100 lg:bg-white/20 text-blue-600 lg:text-white shadow-lg'
                      : 'text-gray-700 lg:text-blue-100 hover:bg-gray-100 lg:hover:bg-white/10'
                  }`}
                >
                  <item.icon 
                    className={`w-5 h-5 transition-colors ${
                      isActiveRoute(item.path) 
                        ? 'text-blue-600 lg:text-white' 
                        : 'text-gray-500 lg:text-blue-200 group-hover:text-blue-600 lg:group-hover:text-white'
                    }`} 
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-blue-500 lg:border-blue-400 space-y-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-700 lg:text-blue-100 hover:bg-gray-100 lg:hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <Link
              to="/"
              className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-700 lg:text-blue-100 hover:bg-gray-100 lg:hover:bg-white/10 transition-colors"
            >
              <FaHome className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-600 lg:text-red-300 hover:bg-red-50 lg:hover:bg-red-500/10 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            {/* Mobile Menu Button & Search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FaBars size={20} />
              </button>

              {/* Breadcrumb */}
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">Dashboard</span>
                  {location.pathname !== '/dashboard' && (
                    <>
                      <span className="text-gray-300">/</span>
                      <span className="text-blue-600 font-medium">
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
                  <FaBell size={20} />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Settings */}
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <FaCog size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;