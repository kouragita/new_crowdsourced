import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningPathList = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch learning paths from API when component mounts
    const fetchLearningPaths = async () => {
      try {
        const response = await axios.get('https://e-learn-ncux.onrender.com/api/learning_paths');
        setLearningPaths(response.data);
      } catch (err) {
        setError('Failed to fetch learning paths');
      }
    };

    fetchLearningPaths();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h1>Learning Paths</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {learningPaths.map((path) => (
          <li key={path.id}>{path.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPathList;
