import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaTachometerAlt,
  FaHome,
  FaTrophy,
  FaBook,
  FaDownload
} from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App installed successfully!');
      }
      
      window.deferredPrompt = null;
      setShowInstallPrompt(false);
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      const storedUsername = localStorage.getItem("username");
      
      setIsLoggedIn(!!token);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (cross-tab synchronization)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUsername("");
    setIsMobileMenuOpen(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Navigation items
  const navigationItems = [
    { href: "#features", label: "Features", icon: FaBook },
    { href: "#leaderboard", label: "Top Learners", icon: FaTrophy },
    { href: "#testimonials", label: "Testimonials", icon: FaUser },
  ];

  const userMenuItems = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-gray-100"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                className="flex items-center text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                CrowdSourced
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* PWA Install Button */}
              {showInstallPrompt && (
                <motion.button
                  onClick={installPWA}
                  className="flex items-center space-x-2 text-green-600 border border-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload className="w-4 h-4" />
                  <span>Install App</span>
                </motion.button>
              )}

              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-blue-600">{username}</span>
                  </span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <FaTachometerAlt className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {/* User Info */}
                {isLoggedIn && (
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      Welcome, <span className="font-semibold text-blue-600">{username}</span>
                    </p>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-3">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={() => scrollToSection(item.href)}
                      className="flex items-center space-x-3 w-full text-left text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* User Menu Items */}
                {isLoggedIn && (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {userMenuItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navigationItems.length + index) * 0.1 }}
                      >
                        <Link
                          to={item.to}
                          className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Auth Buttons */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {/* PWA Install Button */}
                  {showInstallPrompt && (
                    <motion.button
                      onClick={installPWA}
                      className="flex items-center justify-center space-x-2 w-full text-green-600 border border-green-600 py-3 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FaDownload className="w-4 h-4" />
                      <span>Install App</span>
                    </motion.button>
                  )}

                  {isLoggedIn ? (
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full text-red-600 border border-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  ) : (
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Link
                          to="/login"
                          className="block text-center text-blue-600 border border-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          to="/signup"
                          className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;