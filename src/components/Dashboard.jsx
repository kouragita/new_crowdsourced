import React from "react";
import { Outlet, Link } from "react-router-dom";
import { FaUser, FaTachometerAlt, FaBook, FaCalendarAlt, FaTrophy } from "react-icons/fa";

const Dashboard = () => {
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
              to="/dashboard" // Default route
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
          <li>
            <Link
              to="/dashboard/admin"
              className="w-full text-left p-2 rounded-lg hover:bg-blue-700"
            >
              <FaTachometerAlt className="inline-block mr-2" />
              Admin Panel
            </Link>
          </li>
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


