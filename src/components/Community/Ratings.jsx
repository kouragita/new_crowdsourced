import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ratings = ({ resourceId }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`https://e-learn-ncux.onrender.com/api/resources/${resourceId}/ratings`);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Failed to fetch ratings:', error);
      }
    };

    fetchRating();
  }, [resourceId]);

  const handleRatingSubmit = async (newRating) => {
    try {
      await axios.post(`/resources/${resourceId}/rating`, { rating: newRating });
      setRating(newRating);
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  return (
    <div>
      <h3>Average Rating: {averageRating}</h3>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
            onClick={() => handleRatingSubmit(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ratings;
