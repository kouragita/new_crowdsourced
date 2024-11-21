import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modules, setModules] = useState([]); // State to hold modules
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedLearningPath, setSelectedLearningPath] = useState(null); // To store the selected learning path
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(5); // Items per page
  const [loading, setLoading] = useState(true); // Loading state for users

  useEffect(() => {
    // Get the currently logged-in username from localStorage
    const loggedInUsername = localStorage.getItem("username");
    setCurrentUser(loggedInUsername);

    if (!loggedInUsername) {
      console.error("No logged-in user found in localStorage");
      return;
    }

    // Fetch all users from the API
    axios
      .get("https://e-learn-ncux.onrender.com/api/users")
      .then((response) => {
        console.log("Fetched users:", response.data); // Log fetched users to debug
        setUsers(response.data);
        setLoading(false); // Stop loading spinner after users are fetched
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false); // Stop loading spinner on error
      });
  }, []);

  useEffect(() => {
    // Log the current user state and the users list
    console.log("Current User:", currentUser);
    console.log("All Users:", users);

    if (currentUser) {
      // Check if the logged-in user exists in the users array
      const loggedInUser = users.find((user) => user.username === currentUser);
      console.log("Logged-in User:", loggedInUser); // Log logged-in user to debug

      // Check if the logged-in user has learning paths
      if (loggedInUser && loggedInUser.learning_paths) {
        console.log("Learning Paths:", loggedInUser.learning_paths); // Log learning paths
      } else {
        console.log("No learning paths found for this user");
      }
    }
  }, [currentUser, users]);

  const viewDetails = (learningPath) => {
    console.log(`Fetching modules for Learning Path ID: ${learningPath.learning_path_id}`);
    
    // Set selected learning path
    setSelectedLearningPath(learningPath);
    setIsModalOpen(true);

    // Fetch modules for the selected learning path
    axios
      .get(
        `https://e-learn-ncux.onrender.com/api/learning_paths/${learningPath.learning_path_id}/modules`
      )
      .then((response) => {
        console.log("Modules API Response:", response.data); // Log the response for debugging
        setModules(response.data); // Update the modules state
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModules([]); // Clear modules when closing modal
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-700">
          You are not logged in.
        </h2>
        <p className="mt-2 text-gray-600">
          Please log in to view your learning paths.
        </p>
      </div>
    );
  }

  // Filter the user data to match the currently logged-in user
  const loggedInUser = users.find((user) => user.username === currentUser);
  console.log("Logged-in User (Filtered):", loggedInUser); // Log the filtered logged-in user

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-semibold">Loading...</p>
      </div>
    );
  }

  if (!loggedInUser || !loggedInUser.learning_paths) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  // Pagination logic for the modules
  const totalPages = Math.ceil(modules.length / itemsPerPage);
  const indexOfLastModule = currentPage * itemsPerPage;
  const indexOfFirstModule = indexOfLastModule - itemsPerPage;
  const currentModules = modules.slice(indexOfFirstModule, indexOfLastModule);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome, {currentUser}!
      </h1>

      {/* User's Learning Paths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loggedInUser.learning_paths.length > 0 ? (
          loggedInUser.learning_paths.map((path) => (
            <div
              key={path.learning_path_id}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              <h2 className="text-xl font-bold text-gray-700">
                {path.learning_path.title} {/* Use correct path property */}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Date Enrolled:{" "}
                {new Date(path.date_enrolled).toLocaleDateString()}
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={() => viewDetails(path)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="bg-gray-200 p-6 rounded-lg text-center">
            <h2 className="text-lg font-bold text-gray-500">
              No Learning Path Assigned
            </h2>
          </div>
        )}
      </div>

      {/* Modal to display the modules */}
      {isModalOpen && selectedLearningPath && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Modules for {selectedLearningPath.learning_path.title} {/* Correctly use the title */}
            </h2>

            {/* Grid to display modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentModules.length > 0 ? (
                currentModules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h3 className="text-xl font-semibold text-gray-700">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <a
                      href={module.resources[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {module.resources[0]?.title}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No modules available for this path.
                </p>
              )}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 mx-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Prev
              </button>
              <span className="px-4 py-2">{currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 mx-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Next
              </button>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;