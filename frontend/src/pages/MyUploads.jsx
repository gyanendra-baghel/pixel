import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Loader,
  Image as ImageIcon,
  FileX,
  Trash2
} from "lucide-react";
import axiosInstance from "../utils/api";

export default function MyUploads() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState("");
  const [galleries, setGalleries] = useState([]);
  const fileInputRef = useRef(null);

  // Check if user is authenticated
  useEffect(() => {
    // Fetch user uploads
    fetchUserUploads();

    // // Fetch galleries
    fetchGalleries();
  }, [navigate]);

  // Fetch user uploads
  const fetchUserUploads = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/gallery/images/uploads");
      setUploads(response.data);
    } catch (err) {
      console.error("Error fetching uploads:", err);
      setError("Failed to load your uploads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch galleries
  const fetchGalleries = async () => {
    try {
      const response = await axiosInstance.get("/api/gallery/access/my-galleries?access=uploader");
      setGalleries(response.data);
      if (response.data.length > 0) {
        setSelectedGallery(response.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching galleries:", err);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Process each file
    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not an image.`);
        return;
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 10MB size limit.`);
        return;
      }

      uploadFile(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload file to server
  const uploadFile = async (file) => {
    // Create upload object
    const uploadItem = {
      id: Date.now().toString(),
      file,
      filename: file.name,
      progress: 0,
      status: "uploading",
      error: null
    };

    // Add to uploads state
    setUploads(prev => [uploadItem, ...prev]);

    // Create form data
    const formData = new FormData();
    formData.append("image", file);
    formData.append("galleryId", selectedGallery);

    try {
      // Upload file with progress tracking
      const response = await axiosInstance.post("/api/gallery/images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          // Update progress
          setUploads(prev =>
            prev.map(item =>
              item.id === uploadItem.id
                ? { ...item, progress: percentCompleted }
                : item
            )
          );
        }
      });

      // Update upload status on completion
      setUploads(prev =>
        prev.map(item =>
          item.id === uploadItem.id
            ? {
              ...item,
              status: "complete",
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
      console.error("Upload error:", err);

      // Update upload status on error
      setUploads(prev =>
        prev.map(item =>
          item.id === uploadItem.id
            ? {
              ...item,
              status: "error",
              error: err.response?.data?.message || "Upload failed"
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
        await axiosInstance.delete(`/api/uploads/${uploadId}`);
      } catch (err) {
        console.error("Error deleting upload:", err);
        setError("Failed to delete upload. Please try again.");
        return;
      }
    }

    // Remove from state
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Approved",
          color: "bg-green-500",
          icon: <Check size={16} className="text-green-500" />
        };
      case "REJECTED":
        return {
          label: "Rejected",
          color: "bg-red-500",
          icon: <X size={16} className="text-red-500" />
        };
      case "PENDING":
        return {
          label: "Pending Review",
          color: "bg-yellow-500",
          icon: <AlertCircle size={16} className="text-yellow-500" />
        };
      case "uploading":
        return {
          label: "Uploading...",
          color: "bg-blue-500",
          icon: <Loader size={16} className="text-blue-500 animate-spin" />
        };
      case "complete":
        return {
          label: "Upload Complete",
          color: "bg-green-500",
          icon: <Check size={16} className="text-green-500" />
        };
      case "error":
        return {
          label: "Upload Failed",
          color: "bg-red-500",
          icon: <FileX size={16} className="text-red-500" />
        };
      default:
        return {
          label: status,
          color: "bg-gray-500",
          icon: null
        };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
        <p className="text-gray-600">Upload your images for admin review</p>
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

      {/* Upload form */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-1">
            Select Gallery
          </label>
          <select
            id="gallery"
            value={selectedGallery}
            onChange={(e) => setSelectedGallery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={galleries.length === 0}
          >
            {galleries.length === 0 ? (
              <option>No galleries available</option>
            ) : (
              galleries.map(gallery => (
                <option key={gallery.id} value={gallery.id}>
                  {gallery.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={36} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-700 font-medium">Click to select images or drag and drop</p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
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
      {uploads.filter(upload => upload.status === "uploading" || upload.status === "error").length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Current Uploads</h3>
          <div className="space-y-4">
            {uploads
              .filter(upload => upload.status === "uploading" || upload.status === "error")
              .map(upload => {
                const statusInfo = getStatusDisplay(upload.status);

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
                        <button
                          onClick={() => removeUpload(upload.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {upload.status === "uploading" && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${upload.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Uploading...</span>
                            <span>{upload.progress}%</span>
                          </div>
                        </div>
                      )}

                      {upload.status === "error" && (
                        <div className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {upload.error || "Upload failed"}
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
        ) : uploads.filter(upload => upload.status !== "uploading" && upload.status !== "error").length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">You haven't uploaded any images yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {uploads
              .filter(upload => upload.status !== "uploading" && upload.status !== "error")
              .map(upload => {
                const statusInfo = getStatusDisplay(upload.status);

                return (
                  <div
                    key={upload.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={`http://localhost:5002${upload.fileUrl}` || "/placeholder.svg"}
                        alt={upload.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color.replace("bg-", "bg-opacity-75 text-")}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <button
                        onClick={() => removeUpload(upload.id, true)}
                        className="absolute bottom-2 right-2 p-1 bg-red-500 bg-opacity-75 rounded-full text-white hover:bg-opacity-100 transition-opacity"
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
}
