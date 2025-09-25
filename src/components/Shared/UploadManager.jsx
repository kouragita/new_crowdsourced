import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import apiClient from "../../services/api";
import { FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UploadManager = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadedFile(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setUploadedFile(response.data);
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div className="w-full p-4 border-2 border-dashed rounded-lg text-center transition-colors dark:border-gray-600 
      ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-gray-400'}"
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <FaSpinner className="animate-spin text-blue-500 w-8 h-8 mb-2" />
              <p className="dark:text-white">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-4 text-red-500">
              <FaTimesCircle className="w-8 h-8 mb-2" />
              <p>{error}</p>
              <p className="text-sm">Click to try again</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center justify-center py-4 text-green-500">
              <FaCheckCircle className="w-8 h-8 mb-2" />
              <p>File uploaded successfully!</p>
              <p className="text-sm">Click to upload another file</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 cursor-pointer">
              <FaUpload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="dark:text-white">Drag & drop a file here, or click to select</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF, MP4, MOV, etc.</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default UploadManager;
