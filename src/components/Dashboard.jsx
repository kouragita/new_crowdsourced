import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import { FaUser, FaTachometerAlt, FaBook, FaCalendarAlt } from "react-icons/fa"; // Import icons from React Icons

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-blue-600 text-white w-64 p-6">
        <h2 className="text-2xl font-bold mb-8">Student Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/profile" // Link to the Profile page
              onClick={() => handleTabChange("profile")}
              className={`w-full text-left p-2 rounded-lg ${
                activeTab === "profile" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
            >
              <FaUser className="inline-block mr-2" /> {/* Profile Icon */}
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/user-dashboard" // Link to the User Dashboard
              onClick={() => handleTabChange("dashboard")}
              className={`w-full text-left p-2 rounded-lg ${
                activeTab === "dashboard" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
            >
              <FaTachometerAlt className="inline-block mr-2" /> {/* Dashboard Icon */}
              User Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/courses" // Link to the Courses page
              onClick={() => handleTabChange("courses")}
              className={`w-full text-left p-2 rounded-lg ${
                activeTab === "courses" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
            >
              <FaBook className="inline-block mr-2" /> {/* Courses Icon */}
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/calendar" // Link to the Calendar page
              onClick={() => handleTabChange("calendar")}
              className={`w-full text-left p-2 rounded-lg ${
                activeTab === "calendar" ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
            >
              <FaCalendarAlt className="inline-block mr-2" /> {/* Calendar Icon */}
              Calendar
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome To Your Dashboard</h1>
        {/* Other content */}
      </div>
    </div>
  );
};

export default Dashboard;
