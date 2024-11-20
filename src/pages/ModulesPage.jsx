import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ModulesPage = () => {
  const { pathId, moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://e-learn-ncux.onrender.com/api/modules/${moduleId}?pathId=${pathId}`
        );
        if (response.data) {
          setModule(response.data);
        } else {
          setError("Module not found.");
        }
      } catch (error) {
        setError("Failed to fetch module details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (pathId && moduleId) {
      fetchModule();
    } else {
      setError("Invalid path ID or module ID.");
    }
  }, [pathId, moduleId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-semibold">Loading module details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Module Details</h1>
      {error && (
        <div className="text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}
      {module ? (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{module.title}</h2>
          <p className="text-gray-600 mb-4">{module.description}</p>
          {/* Additional details */}
          {module.duration && (
            <p className="text-gray-500">Duration: {module.duration} minutes</p>
          )}
          {module.createdAt && (
            <p className="text-gray-500">Created on: {new Date(module.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      ) : (
        <p>No module available with the provided ID.</p>
      )}
      <button
        onClick={() => navigate(`/paths/${pathId}`)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        Back to Path
      </button>
    </div>
  );
};

export default ModulesPage;