import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaTachometerAlt,
  FaBook,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false); // To determine if the user is an admin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");
        if (!token || !username) throw new Error("Authorization or username missing.");

        // Fetch all users and roles
        const [userResponse, roleResponse] = await Promise.all([
          axios.get("https://e-learn-ncux.onrender.com/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://e-learn-ncux.onrender.com/api/roles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Find the logged-in user's data
        const currentUser = userResponse.data.find(
          (user) => user.username === username
        );
        if (!currentUser) throw new Error("User not found.");

        // Check if the user's role is admin
        const userRole = roleResponse.data.find(
          (role) => role.id === currentUser.role_id
        );
        if (userRole?.name.toLowerCase() === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch user data.";
        setError(errorMsg);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-semibold">Loading dashboard...</p>
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 py-4">{error}</div>;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-blue-600 text-white w-64 p-6">
        <h2 className="text-2xl font-bold mb-8">Student Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard/profile"
              className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
            >
              <FaUser className="inline-block mr-2" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
            >
              <FaTachometerAlt className="inline-block mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/courses"
              className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
            >
              <FaBook className="inline-block mr-2" />
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/calendar"
              className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
            >
              <FaCalendarAlt className="inline-block mr-2" />
              Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/leaderboard"
              className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
            >
              <FaTrophy className="inline-block mr-2" />
              Leaderboard
            </Link>
          </li>
          {/* Admin Panel Link (visible only to admins) */}
          {isAdmin && (
            <li>
              <Link
                to="/dashboard/admin"
                className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
              >
                <FaTachometerAlt className="inline-block mr-2" />
                Admin Panel
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 text-center">
        <Outlet /> {/* Renders child route content */}
      </div>
    </div>
  );
};

export default Dashboard;