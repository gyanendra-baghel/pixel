import { useState, useEffect } from "react";
import {
  Eye, EyeOff, Filter, Check, X, Loader, MessageSquare,
  Save, Calendar, ArrowLeft, X as Close
} from "lucide-react";
import axiosInstance from "../utils/api";
import { useParams } from "react-router-dom";

export function ReviewImages() {
  const { galleryId } = useParams();
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewNote, setReviewNote] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState({});
  const [dateGroups, setDateGroups] = useState({});

  // Fetch images on component mount and when filter changes
  useEffect(() => {
    fetchImages();
  }, [filter]);

  // Group images by date when images change
  useEffect(() => {
    const grouped = images.reduce((groups, image) => {
      const date = formatDate(image.uploadedAt, true);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(image);
      return groups;
    }, {});
    setDateGroups(grouped);
  }, [images]);

  // Add event listener for escape key to close fullscreen view
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [fullscreenImage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/gallery/images/${galleryId}`, {
        params: { status: filter !== "all" ? filter : undefined },
      });
      setImages(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (imageId, status, note) => {
    try {
      setSubmitting(prev => ({ ...prev, [imageId]: true }));

      await axiosInstance.patch(`/api/gallery/images/review/${imageId}`,
        {
          status,
          reviewNote: note || reviewNote[imageId] || ""
        }
      );

      // Update local state to reflect the change
      setImages(images.map(img =>
        img.id === imageId ? { ...img, status, reviewNote: note || reviewNote[imageId] || "" } : img
      ));

      // Clear review note editor
      setShowNoteEditor(prev => {
        const updated = { ...prev };
        delete updated[imageId];
        return updated;
      });

    } catch (err) {
      console.error("Error updating image status:", err);
      alert("Failed to update image status. Please try again.");
    } finally {
      setSubmitting(prev => {
        const updated = { ...prev };
        delete updated[imageId];
        return updated;
      });
    }
  };

  const handleNoteChange = (imageId, note) => {
    setReviewNote(prev => ({
      ...prev,
      [imageId]: note
    }));
  };

  const openFullscreen = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setShowNoteEditor({});
  };

  const toggleNoteEditor = (imageId) => {
    setShowNoteEditor(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  // Format date
  const formatDate = (dateString, asKey = false) => {
    if (!dateString) return asKey ? "Unknown Date" : "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: asKey ? "short" : "long",
      day: "numeric",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status, size = 16) => {
    switch (status) {
      case "APPROVED":
        return <Eye size={size} />;
      case "REJECTED":
        return <EyeOff size={size} />;
      default:
        return <MessageSquare size={size} />;
    }
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Review Images</h2>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">All Images</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin mr-2" size={24} />
          <span>Loading images...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No images found matching the selected filter</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(dateGroups).map(([date, imageGroup]) => (
            <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 flex items-center border-b">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <h3 className="font-medium text-gray-700">{date}</h3>
                <span className="ml-2 text-gray-500 text-sm">({imageGroup.length} images)</span>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imageGroup.map((image) => (
                    <div
                      key={image.id}
                      className="flex flex-col"
                    >
                      {/* Image Thumbnail */}
                      <div
                        className="relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200"
                        onClick={() => openFullscreen(image)}
                      >
                        <div className="aspect-square">
                          <img
                            src={`http://localhost:5002${image.fileUrl}`}
                            alt={image.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(image.status)}`}>
                            {getStatusIcon(image.status, 12)}
                            <span className="ml-1">{image.status}</span>
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                          <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200">
                            <button className="bg-white text-gray-800 rounded-full p-2">
                              <Eye size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image View */}
      {fullscreenImage && (
        <div className="fixed inset-0 top-0 left-0 bg-black bg-opacity-90 z-50 flex flex-col md:flex-row">
          {/* Image Area */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <img
              src={`http://localhost:5002${fullscreenImage.fileUrl}`}
              alt={fullscreenImage.filename}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg";
              }}
            />

            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
            >
              <Close size={24} />
            </button>
          </div>

          {/* Sidebar Details */}
          <div className="w-full md:w-80 bg-white flex flex-col h-full md:h-auto">
            <div className="p-4 bg-gray-100 border-b flex items-center justify-between">
              <button
                onClick={closeFullscreen}
                className="md:hidden flex items-center text-gray-600"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Gallery
              </button>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(fullscreenImage.status)}`}>
                {getStatusIcon(fullscreenImage.status)}
                <span className="ml-1">{fullscreenImage.status}</span>
              </span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="font-medium text-gray-800 mb-2">{fullscreenImage.filename}</h3>

              <div className="text-sm text-gray-600 mb-4">
                <p>Uploaded: {formatDate(fullscreenImage.uploadedAt)}</p>
              </div>

              {/* Review Note Display */}
              {(fullscreenImage.reviewNote || reviewNote[fullscreenImage.id]) && !showNoteEditor[fullscreenImage.id] && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Review Note:</h4>
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    {reviewNote[fullscreenImage.id] || fullscreenImage.reviewNote}
                  </div>
                </div>
              )}

              {/* Note Editor */}
              {showNoteEditor[fullscreenImage.id] && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Review Note:</h4>
                  <textarea
                    value={reviewNote[fullscreenImage.id] !== undefined ? reviewNote[fullscreenImage.id] : fullscreenImage.reviewNote || ""}
                    onChange={(e) => handleNoteChange(fullscreenImage.id, e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    rows="5"
                    placeholder="Add review notes..."
                  ></textarea>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t">
              {!showNoteEditor[fullscreenImage.id] ? (
                <button
                  onClick={() => toggleNoteEditor(fullscreenImage.id)}
                  className="w-full mb-3 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex justify-center items-center"
                >
                  <MessageSquare size={16} className="mr-2" />
                  {fullscreenImage.reviewNote ? "Edit Note" : "Add Note"}
                </button>
              ) : (
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={() => toggleNoteEditor(fullscreenImage.id)}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleReviewAction(fullscreenImage.id, fullscreenImage.status, reviewNote[fullscreenImage.id]);
                      toggleNoteEditor(fullscreenImage.id);
                    }}
                    disabled={submitting[fullscreenImage.id]}
                    className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex justify-center items-center"
                  >
                    {submitting[fullscreenImage.id] ? (
                      <Loader size={16} className="animate-spin mr-2" />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    Save
                  </button>
                </div>
              )}

              {fullscreenImage.status === "PENDING" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReviewAction(fullscreenImage.id, "REJECTED")}
                    disabled={submitting[fullscreenImage.id]}
                    className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md flex justify-center items-center"
                  >
                    {submitting[fullscreenImage.id] ? (
                      <Loader size={16} className="animate-spin mr-2" />
                    ) : (
                      <X size={16} className="mr-2" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => handleReviewAction(fullscreenImage.id, "APPROVED")}
                    disabled={submitting[fullscreenImage.id]}
                    className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md flex justify-center items-center"
                  >
                    {submitting[fullscreenImage.id] ? (
                      <Loader size={16} className="animate-spin mr-2" />
                    ) : (
                      <Check size={16} className="mr-2" />
                    )}
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
