import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const ContributorDashboardView = () => {
  const [authoredCourses, setAuthoredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthoredCourses = async () => {
      try {
        const response = await apiClient.get('/users/me/authored-paths');
        setAuthoredCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch authored courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthoredCourses();
  }, []);

  if (loading) {
    return <div>Loading your content...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Content</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create New Course</button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <ul>
            {authoredCourses.length > 0 ? authoredCourses.map(course => (
              <li key={course.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="dark:text-white">{course.title}</span>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {course.status || 'Draft'} 
                  </span>
                  <button className="text-sm text-blue-500 hover:underline ml-4">Edit</button>
                </div>
              </li>
            )) : <p className="dark:text-white">You have not authored any courses yet.</p>}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">AI Content Assistant</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <textarea 
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" 
            rows="4" 
            placeholder="Enter a topic to get content ideas, outlines, or quiz questions..."
          ></textarea>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-2">Generate Ideas</button>
        </div>
      </div>
    </div>
  );
};

export default ContributorDashboardView;
