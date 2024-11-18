import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressTracker from '../Shared/ProgressTracker';

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://e-learn-ncux.onrender.com/api/progress/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>Points: {profile.points}</p>
      <p>XP: {profile.xp}</p>
      <h2>Achievements</h2>
      <ul>
        {profile.achievements.map((achievement) => (
          <li key={achievement.id}>{achievement.title}</li>
        ))}
      </ul>
      <ProgressTracker userId={userId} />
    </div>
  );
};

export default UserProfile;
