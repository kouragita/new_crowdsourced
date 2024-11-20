// import React from "react";

// const UserDashboard = () => {
//   const courses = [
//     { id: 1, title: "Introduction to Programming", status: "Enrolled" },
//     { id: 2, title: "Data Structures and Algorithms", status: "Enrolled" },
//     { id: 3, title: "Web Development", status: "Completed" },
//   ];

//   return (
//     <div>
//       <h3 className="text-xl font-semibold text-gray-800">Your Courses</h3>
//       <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
//         <ul>
//           {courses.map((course) => (
//             <li key={course.id} className="flex justify-between items-center mt-4">
//               <span className="text-gray-800">{course.title}</span>
//               <span className="text-sm text-gray-600">{course.status}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
  const { id } = useParams(); // Extract 'id' from URL
  const [learningPath, setLearningPath] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Learning path ID is missing');
      setLoading(false);
      return;
    }

    const fetchLearningPathDetails = async () => {
      try {
        setLoading(true);

        // Fetch Learning Path details
        const pathResponse = await axios.get(`https://e-learn-ncux.onrender.com/api/learning_paths/${id}`);
        setLearningPath(pathResponse.data);

        // Fetch Modules associated with this learning path
        const modulesResponse = await axios.get(`https://e-learn-ncux.onrender.com/api/modules?learning_path_id=${id}`);
        setModules(modulesResponse.data);

        // Fetch Quizzes associated with this learning path
        const quizzesResponse = await axios.get(`https://e-learn-ncux.onrender.com/api/quizzes?learning_path_id=${id}`);
        setQuizzes(quizzesResponse.data);
      } catch (error) {
        setError('Unable to fetch learning path details');
        console.error("Error fetching learning path details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPathDetails();
  }, [id]);

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