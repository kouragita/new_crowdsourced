import React from "react";

const UserProfile = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800">Your Profile</h3>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg font-medium text-gray-800">Name: John Doe</p>
        <p className="mt-2 text-gray-600">Email: johndoe@example.com</p>
        <p className="mt-2 text-gray-600">Member Since: January 2020</p>
      </div>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
