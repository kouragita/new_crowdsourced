import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null); // For a single user
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
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

        setUserData(currentUser);
        setRoles(roleResponse.data);
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

  if (!userData || roles.length === 0)
    return <div className="text-center text-gray-600 py-4">No data available.</div>;

  const {
    username = "N/A",
    email = "N/A",
    role_id,
    profile: { points = "N/A", xp = "N/A", bio = "N/A", avatar_url, last_active = "N/A" } = {},
  } = userData;

  const userRole =
    roles.find((role) => role.id === role_id)?.name || "No role assigned";
  const roleDescription =
    roles.find((role) => role.id === role_id)?.description || "N/A";

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="absolute -bottom-16 left-6">
            <img
              src={avatar_url || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>
        <div className="mt-20 p-6">
          {/* User Info */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{username || "N/A"}</h1>
            <p className="text-gray-600">{email || "N/A"}</p>
            <p className="mt-2 inline-block px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              {userRole || "N/A"}
            </p>
          </div>

          {/* Detailed Info */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">About Me</h2>
              <p className="mt-2 text-gray-800">{bio || "No bio provided."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Role Description</h2>
              <p className="mt-2 text-gray-800">
                {roleDescription || "No role description available."}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Points</h2>
              <p className="mt-2 text-gray-800">{points || "N/A"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">XP</h2>
              <p className="mt-2 text-gray-800">{xp || "N/A"}</p>
            </div>
            <div className="sm:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700">Last Active</h2>
              <p className="mt-2 text-gray-800">{last_active || "N/A"}</p>
            </div>
          </div>
        </div>
        {/* Footer Section */}
        <div className="bg-gray-50 py-4 px-6">
          <p className="text-center text-sm text-gray-600">
            Thank you for being part of our community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;