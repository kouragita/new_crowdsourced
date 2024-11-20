import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state
  const navigate = useNavigate(); // For navigation

  // Check authentication status on component mount or when token changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Set login state based on token existence
  }, [localStorage.getItem("authToken")]); // Add a listener to update when token changes

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from storage
    setIsLoggedIn(false); // Update login state
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Make the CrowdSource logo clickable to navigate to the home page */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CrowdSourced
        </Link>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#leaderboard" className="hover:text-blue-600">Top Learners</a>
          <a href="#testimonials" className="hover:text-blue-600">Testimonials</a>
        </nav>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-100"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-100"
              >
                Logout
              </button>
            </>
          ) : (
            // Show Login and Sign Up links if the user is not logged in
            <>
              <Link
                to="/login"
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;