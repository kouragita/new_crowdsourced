import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('https://e-learn-ncux.onrender.com/api/leaderboards');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ol>
        {leaderboard.map((user) => (
          <li key={user.id}>
            {user.username} - {user.points} points
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
