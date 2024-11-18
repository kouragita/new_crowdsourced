import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LearningPathDetail = () => {
  const { id } = useParams();
  const [learningPath, setLearningPath] = useState(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await axios.get(`/learning-paths/${id}`);
        setLearningPath(response.data);
      } catch (error) {
        console.error('Failed to fetch learning path:', error);
      }
    };

    fetchLearningPath();
  }, [id]);

  if (!learningPath) return <p>Loading...</p>;

  return (
    <div>
      <h1>{learningPath.title}</h1>
      <p>{learningPath.description}</p>
      <ul>
        {learningPath.modules.map((module) => (
          <li key={module.id}>{module.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPathDetail;
