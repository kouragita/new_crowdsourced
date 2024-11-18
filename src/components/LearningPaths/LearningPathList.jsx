import React, { useEffect } from 'react';
import useLearningPathsStore from '../../stores/learningPathsStore';

const LearningPathList = () => {
  const { learningPaths, fetchLearningPaths } = useLearningPathsStore();

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  return (
    <div>
      <h1>Learning Paths</h1>
      <ul>
        {learningPaths.map((path) => (
          <li key={path.id}>{path.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPathList;
