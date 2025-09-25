import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const LearnerDashboardView = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await apiClient.get('/users/me/enrolled-paths');
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  // Placeholder data for recommendations
  const recommendedCourses = [
    { id: 3, title: 'Data Science with Pandas' },
    { id: 4, title: 'Advanced JavaScript Concepts' },
  ];

  if (loading) {
    return <div>Loading your learning path...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2 dark:text-white">{course.title}</h3>
              {/* Progress bar would require more data - placeholder for now */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `50%` }}></div>
              </div>
              <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">50% Complete</p>
            </div>
          )) : <p className="dark:text-white">You are not enrolled in any courses yet.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">AI-Powered Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedCourses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
              <h3 className="font-bold text-lg dark:text-white">{course.title}</h3>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Enroll</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboardView;
