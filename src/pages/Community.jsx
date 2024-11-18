import React from 'react';
import DiscussionThread from '../components/Community/DiscussionThread';

const Community = () => (
  <div>
    <h1>Community Discussions</h1>
    <DiscussionThread resourceId={1} /> {/* Replace with dynamic ID if needed */}
  </div>
);

export default Community;
