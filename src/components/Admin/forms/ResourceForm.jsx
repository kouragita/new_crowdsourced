import React, { useState, useEffect } from 'react';
import CloudinaryUpload from '../CloudinaryUpload';

const ResourceForm = ({ onSubmit, initialData = {}, onCancel, moduleId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    url: '',
    module_id: moduleId
  });

  useEffect(() => {
    if (initialData.id) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'video',
        url: initialData.url || '',
        module_id: initialData.module_id || moduleId
      });
    }
  }, [initialData, moduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = (uploadResult) => {
    setFormData(prev => ({ 
        ...prev, 
        url: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
        file_size: uploadResult.bytes,
        duration: Math.round(uploadResult.duration || 0)
    }));
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
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="link">External Link</option>
        </select>
      </div>
      {formData.type !== 'link' ? (
        <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <CloudinaryUpload onUploadSuccess={handleUploadSuccess} />
            {formData.url && <p className="text-sm text-green-600 mt-2">Upload successful! <a href={formData.url} target="_blank" rel="noopener noreferrer" className="underline">View file</a></p>}
        </div>
      ) : (
        <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">External URL</label>
            <input type="url" name="url" id="url" value={formData.url} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
        </div>
      )}
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Resource
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
