import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('https://e-learn-ncux.onrender.com/api/challenges');
        setChallenges(response.data);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  const handleJoinChallenge = async (challengeId) => {
    try {
      await axios.post('/challenges/participate', { challengeId });
      alert('Successfully joined the challenge!');
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  return (
    <div>
      <h1>Challenges</h1>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <button onClick={() => handleJoinChallenge(challenge.id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeList;
