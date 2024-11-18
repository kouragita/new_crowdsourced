import React from 'react';
import LearningPathList from '../components/LearningPaths/LearningPathList';
import Leaderboard from '../components/Gamification/Leaderboard';

const Home = () => (
  <div>
    <h1>Welcome to the Learning Platform</h1>
    <LearningPathList />
    <Leaderboard />
  </div>
);

export default Home;
