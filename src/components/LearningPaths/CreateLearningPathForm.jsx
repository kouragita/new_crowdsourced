import React, { useState } from 'react';
import axios from 'axios';

const CreateLearningPathForm = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/learning-paths', formData);
      alert('Learning path created successfully!');
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to create learning path:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <button type="submit">Create Learning Path</button>
    </form>
  );
};

export default CreateLearningPathForm;
