import React from 'react';
import UserProfile from '../components/Gamification/UserProfile';

const Profile = ({ userId }) => (
  <div>
    <h1>My Profile</h1>
    <UserProfile userId={userId} />
  </div>
);

export default Profile;
