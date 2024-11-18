import React from 'react';
import CommentsSection from './CommentsSection';

const DiscussionThread = ({ resourceId }) => {
  return (
    <div>
      <h1>Discussion</h1>
      <CommentsSection resourceId={resourceId} />
    </div>
  );
};

export default DiscussionThread;
