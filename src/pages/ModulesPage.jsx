import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ModulesPage = () => {
  const { id } = useParams(); // Get the learning path ID from the URL
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Module Path ID:', id); // Debugging the path ID
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://e-learn-ncux.onrender.com/api/learning_paths/${id}/modules`
        );
        console.log('Fetched modules:', response.data);  // Check the fetched data
        setModules(response.data); // Update state with the modules
      } catch (error) {
        setError("Failed to fetch modules. Please try again later.");
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModules();
    }
  }, [id]); // Re-fetch if ID changes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Modules for Path {id}</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6">
        {modules.length > 0 ? (
          modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  {module.title}
                </h2>
                <p className="text-gray-600">{module.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No modules available for this learning path.</p>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;
