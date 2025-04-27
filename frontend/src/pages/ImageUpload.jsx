import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { throttle } from 'lodash';
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Loader,
  Image as ImageIcon,
  FileX,
  Trash2,
  FilePlus,
  FileImage,
  RotateCw
} from 'lucide-react';
import axiosInstance from '../utils/api';

const ImageUpload = () => {
  const navigate = useNavigate();
  const { galleryId } = useParams(); // Get galleryId from route
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    uploading: 0
  });
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Throttled progress update function to minimize re-renders
  const throttledProgress = useCallback(
    throttle((uploadItemId, percentCompleted) => {
      setUploads(prev =>
        prev.map(item =>
          item.id === uploadItemId
            ? { ...item, progress: percentCompleted }
            : item
        )
      );
    }, 100), // Update at most every 100ms
    []
  );

  useEffect(() => {
    // Fetch user uploads, filtered by galleryId
    const fetchUserUploads = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/gallery/${galleryId}/images/user`);
        // Initialize uploads with data from the server
        setUploads(response.data.map(upload => ({
          ...upload,
          status: upload.status || 'complete',
          progress: 100
        })));
      } catch (err) {
        console.error('Failed to fetch uploads:', err);
        setError('Failed to load your uploads. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserUploads();
  }, [galleryId]);

  // Update upload statistics when uploads change
  useEffect(() => {
    console.log(uploads);
    // Calculate upload statistics
    const stats = uploads.reduce(
      (acc, upload) => {
        acc.total++;
        if (upload.status === 'complete' || upload.status === 'APPROVED' || upload.status === 'REJECTED' || upload.status === 'PENDING') {
          acc.completed++;
        } else if (upload.status === 'error') {
          acc.failed++;
        } else if (upload.status === 'uploading') {
          acc.uploading++;
        }
        return acc;
      },
      { total: 0, completed: 0, failed: 0, uploading: 0 }
    );
    setUploadStats(stats);
  }, [uploads]);

  // Set up drag and drop event handlers
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (e.currentTarget.contains(e.relatedTarget)) return;
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files || []);
      processFiles(files);
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragenter', handleDragEnter);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragenter', handleDragEnter);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Process multiple files
  const processFiles = (files) => {
    if (files.length === 0) return;

    // Filter valid files
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not an image.`);
        return;
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds the 10MB size limit.`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors if any
    if (errors.length > 0) {
      setError(errors.join(' '));
    }

    // Upload valid files
    validFiles.forEach(file => uploadFile(file));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection from input
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  // Upload file to server
  const uploadFile = async (file) => {
    // Create upload object with unique ID
    const uploadItem = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      filename: file.name,
      progress: 0,
      status: 'uploading',
      error: null
    };

    // Add to uploads state
    setUploads(prev => [uploadItem, ...prev]);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('galleryId', galleryId);

    try {
      // Upload file with progress tracking
      const response = await axiosInstance.post('/api/gallery/images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          throttledProgress(uploadItem.id, percentCompleted);
        }
      });

      // Final update once completed
      setUploads(prev =>
        prev.map(item =>
          item.id === uploadItem.id
            ? {
              ...item,
              status: 'PENDING', // Assuming PENDING is the initial state after upload
              id: response.data.id, // Replace temp id with server id
              fileUrl: response.data.fileUrl,
              uploadedAt: response.data.uploadedAt,
              galleryId: response.data.galleryId,
              progress: 100
            }
            : item
        )
      );

    } catch (err) {
      console.error('Upload error:', err);

      // Update upload status on error
      setUploads(prev =>
        prev.map(item =>
          item.id === uploadItem.id
            ? {
              ...item,
              status: 'error',
              error: err.response?.data?.message || 'Upload failed'
            }
            : item
        )
      );
    }
  };

  // Remove upload from list
  const removeUpload = async (uploadId, isCompleted = false) => {
    if (isCompleted) {
      // Delete from server if already uploaded
      try {
        await axiosInstance.delete(`/api/gallery/images/${uploadId}`);
      } catch (err) {
        console.error('Error deleting upload:', err);
        setError('Failed to delete upload. Please try again.');
        return;
      }
    }

    // Remove from state
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  };

  // Retry failed upload
  const retryUpload = (upload) => {
    uploadFile(upload.file);
    // Remove the failed upload
    setUploads(prev => prev.filter(item => item.id !== upload.id));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          color: 'bg-green-500 text-white',
          icon: <Check size={16} className="text-white" />
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          color: 'bg-red-500 text-white',
          icon: <X size={16} className="text-white" />
        };
      case 'PENDING':
        return {
          label: 'Pending Review',
          color: 'bg-yellow-500 text-white',
          icon: <AlertCircle size={16} className="text-white" />
        };
      case 'uploading':
        return {
          label: 'Uploading...',
          color: 'bg-blue-500 text-white',
          icon: <Loader size={16} className="text-white animate-spin" />
        };
      case 'complete':
        return {
          label: 'Upload Complete',
          color: 'bg-green-500 text-white',
          icon: <Check size={16} className="text-white" />
        };
      case 'error':
        return {
          label: 'Upload Failed',
          color: 'bg-red-500 text-white',
          icon: <FileX size={16} className="text-white" />
        };
      default:
        return {
          label: status,
          color: 'bg-gray-500 text-white',
          icon: null
        };
    }
  };

  // Get progress bar color based on progress
  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
          <p className="text-gray-600">Upload your images for admin review</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
              {uploadStats.total} Total
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-medium">
              {uploadStats.completed} Completed
            </span>
            {uploadStats.uploading > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md font-medium">
                {uploadStats.uploading} Uploading
              </span>
            )}
            {uploadStats.failed > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md font-medium">
                {uploadStats.failed} Failed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload form with drag & drop */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mt-4">
          <div
            ref={dropAreaRef}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
              }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {isDragging ? (
              <>
                <FileImage size={48} className="mx-auto text-blue-500 mb-2" />
                <p className="text-blue-700 font-medium">Drop images to upload</p>
                <p className="text-blue-600 text-sm mt-1">Release to upload your files</p>
              </>
            ) : (
              <>
                <Upload size={36} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-700 font-medium">Click to select images or drag and drop</p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      {/* Active uploads */}
      {uploads.filter(upload => upload?.status === 'uploading' || upload?.status === 'error').length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Current Uploads</h3>

          <div className="space-y-4">
            {uploads
              .filter(upload => upload.status === 'uploading' || upload.status === 'error')
              .map(upload => {
                const statusInfo = getStatusDisplay(upload.status);
                const progressColor = getProgressColor(upload.progress);

                return (
                  <div key={upload.id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                    <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800 truncate" title={upload.filename}>
                          {upload.filename}
                        </h4>
                        <div className="flex items-center gap-2">
                          {upload.status === 'error' && (
                            <button
                              onClick={() => retryUpload(upload)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Retry upload"
                            >
                              <RotateCw size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => removeUpload(upload.id, upload.status === 'complete')}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50"
                            title="Remove from list"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>

                      {upload.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
                              style={{ width: `${upload.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Loader size={12} className="animate-spin mr-1" />
                              Uploading...
                            </span>
                            <span>{upload.progress}%</span>
                          </div>
                        </div>
                      )}

                      {upload.status === 'error' && (
                        <div className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {upload.error || 'Upload failed'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Completed uploads */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Uploads</h3>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin mr-2" size={24} />
            <span>Loading your uploads...</span>
          </div>
        ) : uploads.filter(upload => upload.status !== 'uploading' && upload.status !== 'error').length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">You haven't uploaded any images yet</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center mx-auto"
            >
              <FilePlus size={18} className="mr-2" />
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {uploads
              .filter(upload => upload.status !== 'uploading' && upload.status !== 'error')
              .map(upload => {
                const statusInfo = getStatusDisplay(upload.status);

                return (
                  <div
                    key={upload.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative h-48">
                      <img
                        src={upload.fileUrl ? `http://localhost:5002${upload.fileUrl}` : '/placeholder.svg'}
                        alt={upload.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          <span className="flex items-center">
                            {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
                            {statusInfo.label}
                          </span>
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition-all duration-200"></div>
                      <button
                        onClick={() => removeUpload(upload.id, true)}
                        className="absolute bottom-2 right-2 p-1.5 bg-red-500 bg-opacity-75 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-100"
                        title="Delete image"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate" title={upload.filename}>
                        {upload.filename}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {formatDate(upload.uploadedAt)}
                      </p>
                      {upload.reviewNote && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <p className="font-medium text-gray-700">Review Note:</p>
                          <p className="text-gray-600">{upload.reviewNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
