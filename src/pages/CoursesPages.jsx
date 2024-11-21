import React, { useEffect, useState } from "react";
import axios from "axios";

const CoursesPage = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [modules, setModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTableVisible, setIsTableVisible] = useState(false); // Track if table is visible
  const [selectedPathId, setSelectedPathId] = useState(null); // Store the selected learning path id

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-learn-ncux.onrender.com/api/learning_paths"
        );
        setLearningPaths(response.data);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
        setError("Failed to fetch learning paths. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(learningPaths.length / itemsPerPage);
  const indexOfLastPath = currentPage * itemsPerPage;
  const indexOfFirstPath = indexOfLastPath - itemsPerPage;
  const currentPaths = learningPaths.slice(indexOfFirstPath, indexOfLastPath);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const fetchModules = async (learningPathId) => {
    try {
      const response = await axios.get(
        `https://e-learn-ncux.onrender.com/api/modules?learning_path_id=${learningPathId}`
      );
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleViewDetails = (learningPathId) => {
    setSelectedPathId(learningPathId);
    fetchModules(learningPathId);
    setIsTableVisible(true);
    // Scroll smoothly to the table
    setTimeout(() => {
      document.getElementById("modulesTable").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100); // Added timeout to ensure the state change happens before scrolling
  };

  const closeTable = () => {
    setIsTableVisible(false);
    setModules([]);
    // Scroll back to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPaths.map((path) => (
          <div
            key={path.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            aria-label={`Learning path: ${path.title}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    path.difficulty === "beginner"
                      ? "bg-green-100 text-green-800"
                      : path.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {path.difficulty}
                </span>
                <div className="flex items-center space-x-1">
                  <svg
                    className="h-4 w-4 text-yellow-400 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-gray-600">
                    {path.rating ? path.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {path.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleViewDetails(path.id)} // Trigger view details
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
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

      {/* Modules Table */}
      {isTableVisible && (
        <div
          id="modulesTable"
          className="mt-10 bg-white p-6 rounded-xl shadow-md overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Modules</h2>
            <button
              onClick={closeTable}
              className="text-red-500 hover:text-red-700"
            >
              X
            </button>
          </div>
          <table className="w-full mt-4 table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Module</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Resources</th>
              </tr>
            </thead>
            <tbody>
              {modules.length > 0 ? (
                modules.map((module) => (
                  <tr key={module.id} className="border-t">
                    <td className="px-4 py-2">{module.title}</td>
                    <td className="px-4 py-2">{module.description}</td>
                    <td className="px-4 py-2">
                      <a
                        href={module.resources[0]?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {module.resources[0]?.title}
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                    No modules available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;