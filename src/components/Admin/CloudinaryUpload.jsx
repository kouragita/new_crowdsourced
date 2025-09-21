import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFile, FaVideo, FaImage, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const CloudinaryUpload = ({ onUploadSuccess }) => {
import toast from 'react-hot-toast';

const CloudinaryUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    // accept: 'video/*,image/*,.pdf,.doc,.docx' // Example of file type restriction
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // 1. Get signature from our backend
      const sigResponse = await adminApi.getUploadSignature();
      const { signature, timestamp, api_key, folder } = sigResponse.data;

      // 2. Upload directly to Cloudinary using Axios
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', api_key);
      formData.append('folder', folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;

      const response = await axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      const data = response.data;

      if (data.error) {
        throw new Error(data.error.message);
      }

      toast.success('File uploaded successfully!');
      onUploadSuccess(data); // Pass full cloudinary response to parent
      setFile(null); // Reset

    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mb-3" />;
    if (file.type.startsWith('video')) return <FaVideo className="w-12 h-12 text-blue-500 mb-3" />;
    if (file.type.startsWith('image')) return <FaImage className="w-12 h-12 text-green-500 mb-3" />;
    return <FaFile className="w-12 h-12 text-purple-500 mb-3" />;
  };

  return (
    <div className="space-y-4">
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                {getFileIcon()}
                {file ? (
                    <p className="text-lg font-medium text-gray-700">{file.name}</p>
                ) : (
                    <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? 'Drop the file here...' : 'Drag & drop a file, or click to select'}
                    </p>
                )}
                <p className="text-sm text-gray-500 mt-1">Video, Image, or Document</p>
            </div>
        </div>

        {file && !uploading && (
            <div className="flex justify-between items-center">
                 <button type="button" onClick={() => setFile(null)} className="text-sm text-red-600 hover:underline">Remove</button>
                 <button type="button" onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upload File
                </button>
            </div>
        )}

        {uploading && (
            <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">{progress}% uploaded</p>
            </div>
        )}
    </div>
  );
};

export default CloudinaryUpload;
