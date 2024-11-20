import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authorization token missing.");

        const userResponse = await axios.get(
          "https://e-learn-ncux.onrender.com/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const roleResponse = await axios.get(
          "https://e-learn-ncux.onrender.com/api/roles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profileResponse = await axios.get(
          "https://e-learn-ncux.onrender.com/api/user-profiles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserData(userResponse.data);
        setRoles(roleResponse.data);
        setUserProfile(profileResponse.data);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch user data.";
        setError(errorMsg);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-semibold">Loading profile...</p>
      </div>
    );
  if (error)
    return <div className="text-center text-red-600 py-4">{error}</div>;

  const { username, email, roleId } = userData || {};
  const userRole = roles.find((role) => role.id === roleId)?.name || "N/A";
  const { address, phone, bio } = userProfile || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <img
            src="https://via.placeholder.com/150"
            alt={username}
            className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-indigo-500"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{username || "N/A"}</h1>
            <p className="text-sm text-gray-600">{userRole}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-sm text-gray-800">{address || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Roles Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700">Your Roles</h2>
          <ul className="mt-4 space-y-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className={`p-3 rounded-lg shadow-md ${
                  role.id === roleId
                    ? "bg-indigo-100 border border-indigo-500"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium text-gray-700">{role.name}</p>
                <p className="text-sm text-gray-600">{role.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
