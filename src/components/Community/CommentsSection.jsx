import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentsSection = ({ resourceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://e-learn-ncux.onrender.com/api/resources/${resourceId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [resourceId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://e-learn-ncux.onrender.com/api/resources/${resourceId}/comment`, {
        text: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.username}</strong>: {comment.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentsSection;
