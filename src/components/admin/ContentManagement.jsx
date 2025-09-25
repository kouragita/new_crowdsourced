import React from 'react';
import UploadManager from '../Shared/UploadManager';

const ContentManagement = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Content Management</h1>
    <p className="dark:text-white">Placeholder for content management tools.</p>
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Upload New Resource</h2>
      <UploadManager onUploadSuccess={(data) => console.log('Uploaded file:', data)} />
    </div>
  </div>
);

export default ContentManagement;
