import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgressTracker = ({ userId }) => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`https://e-learn-ncux.onrender.com/api/progress/${userId}`);
        setProgress(response.data.progress);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    fetchProgress();
  }, [userId]);

  return (
    <div>
      <h2>Progress Tracker</h2>
      <ul>
        {progress.map((module) => (
          <li key={module.id}>
            {module.title} - {module.completed ? 'Completed' : 'In Progress'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;
