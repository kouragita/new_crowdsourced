import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Replace with your auth logic
        const response = await axios.get(
          "https://e-learn-ncux.onrender.com/api/user",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add authorization token
            },
          }
        );
        setUserProfile(response.data); // Set fetched data
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Failed to fetch user profile.";
        setError(errorMsg);
        console.error("API Error:", error); // Log detailed error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;

  const { name, email, phone, bio, address } = userProfile || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/150"
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{name || "N/A"}</h1>
            <p className="text-sm text-gray-500">Expert</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">First Name</p>
              <p className="text-sm text-gray-800">{name?.split(" ")[0] || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Name</p>
              <p className="text-sm text-gray-800">{name?.split(" ")[1] || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-sm text-gray-800">{email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm text-gray-800">{phone || "N/A"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-500">Bio</p>
              <p className="text-sm text-gray-800">{bio || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
