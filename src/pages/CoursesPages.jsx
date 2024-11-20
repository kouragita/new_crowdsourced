import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-learn-ncux.onrender.com/api/learning_paths"
        );
        setLearningPaths(response.data);
      } catch (error) {
        setError("Failed to fetch learning paths. Please try again later.");
        console.error("Error fetching learning paths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  const totalPages = Math.ceil(learningPaths.length / itemsPerPage);
  const indexOfLastPath = currentPage * itemsPerPage;
  const indexOfFirstPath = indexOfLastPath - itemsPerPage;
  const currentPaths = learningPaths.slice(indexOfFirstPath, indexOfLastPath);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Courses</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPaths.length > 0 ? (
          currentPaths.map((path) => (
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
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {path.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM10 15v-4H6v-2h4V5h2v4h4v2h-4v4h-2z" />
                      </svg>
                      <span>{path.modules?.length || 0} modules</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 11h-2V4H8v7H6v8h4v-4h4v4h4v-8z" />
                      </svg>
                      <span>{path.totalEnrolled || 0} enrolled</span>
                    </div>
                  </div>
                  <Link
                    to={`/modules/${path.id}`} // Ensure this path is correct
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No learning paths available.</p>
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
    </div>
  );
};

export default CoursesPage;
