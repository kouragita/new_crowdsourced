import React, { useState, useEffect } from 'react';

const ModuleForm = ({ onSubmit, initialData = {}, onCancel, pathId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 0,
    learning_path_id: pathId
  });

  useEffect(() => {
    if (initialData.id) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        order_index: initialData.order_index || 0,
        learning_path_id: initialData.learning_path_id || pathId
      });
    }
  }, [initialData, pathId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="order_index" className="block text-sm font-medium text-gray-700">Order</label>
        <input
          type="number"
          name="order_index"
          id="order_index"
          value={formData.order_index}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Module
        </button>
      </div>
    </form>
  );
};

export default ModuleForm;
