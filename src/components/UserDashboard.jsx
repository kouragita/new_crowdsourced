import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [learningPath, setLearningPath] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username'); // Retrieve username from localStorage

  useEffect(() => {
    if (!username) {
      setError('Username is missing');
      setLoading(false);
      return;
    }

    const fetchLearningPathDetails = async () => {
      try {
        setLoading(true);

        // Fetch User Learning Path details based on username
        const userLearningPathResponse = await axios.get(`https://e-learn-ncux.onrender.com/api/user-learning-paths?username=${username}`);
        console.log('User Learning Path Response:', userLearningPathResponse.data); // Log user learning path response

        if (userLearningPathResponse.data.length === 0) {
          setError('No learning path found for this user');
          setLoading(false);
          return;
        }

        const learningPathId = userLearningPathResponse.data[0].learning_path_id;
        console.log("Learning Path ID for User:", learningPathId); // Log learning path ID

        // Fetch Learning Path details
        const pathResponse = await axios.get(`https://e-learn-ncux.onrender.com/api/learning_paths/${learningPathId}`);
        setLearningPath(pathResponse.data);

        // Fetch Modules associated with this learning path
        const modulesResponse = await axios.get('https://e-learn-ncux.onrender.com/api/modules');
        console.log('All Modules:', modulesResponse.data); // Log all modules to inspect

        // Filter modules based on learning_path_id
        const filteredModules = modulesResponse.data.filter(module => module.learning_path_id === learningPathId);
        console.log('Filtered Modules:', filteredModules); // Log filtered modules

        // Update state with filtered modules
        setModules(filteredModules);

        // Fetch Quizzes associated with this learning path
        const quizzesResponse = await axios.get(`https://e-learn-ncux.onrender.com/api/quizzes?learning_path_id=${learningPathId}`);
        setQuizzes(quizzesResponse.data);

      } catch (error) {
        setError('Unable to fetch learning path details');
        console.error('Error fetching learning path details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPathDetails();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!learningPath) {
    return <div>Learning Path not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{learningPath.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{learningPath.description}</p>

      {/* Display Modules */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Modules</h2>
        {modules.length > 0 ? (
          <ul>
            {modules.map((module) => (
              <li key={module.id} className="bg-gray-100 p-4 mb-2 rounded shadow-md">
                <h3 className="text-xl font-semibold">{module.title}</h3>
                <p>{module.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No modules available for this learning path.</p>
        )}
      </div>

      {/* Display Quizzes */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Quizzes</h2>
        {quizzes.length > 0 ? (
          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz.id} className="bg-gray-100 p-4 mb-2 rounded shadow-md">
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
                <p>{quiz.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quizzes available for this learning path.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
