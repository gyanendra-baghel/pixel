import React, { useState, useEffect } from "react";
import {
  Eye, EyeOff, Filter, Check, X, Loader, MessageSquare,
  Save, Calendar, ChevronLeft, ChevronRight, X as Close, Edit, Info,
  CheckSquare, Square, CheckCheck, XSquare
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNoteEditor, setShowNoteEditor] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [dateGroups, setDateGroups] = useState({});

  // Bulk actions state
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);

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

  // Clear selection when filter changes
  useEffect(() => {
    setSelectedImages(new Set());
    setSelectMode(false);
  }, [filter]);

  // Add event listener for escape key to close fullscreen view
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null);
      }
    };

    const handleArrowKeys = (e) => {
      if (!fullscreenImage) return;

      if (e.key === 'ArrowRight') {
        navigateToNextImage();
      } else if (e.key === 'ArrowLeft') {
        navigateToPreviousImage();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [fullscreenImage, currentImageIndex, images]);

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

  const handleBulkAction = async (status) => {
    if (selectedImages.size === 0) {
      alert("Please select images first.");
      return;
    }

    try {
      setBulkProcessing(true);
      const updates = Array.from(selectedImages).map(imageId =>
        axiosInstance.patch(`/api/gallery/images/review/${imageId}`, { status })
      );

      await Promise.all(updates);

      // Update local state for all selected images
      setImages(images.map(img =>
        selectedImages.has(img.id) ? { ...img, status } : img
      ));

      // Clear selection and exit select mode
      setSelectedImages(new Set());
      setSelectMode(false);

      alert(`Successfully ${status.toLowerCase()} ${selectedImages.size} images.`);
    } catch (err) {
      console.error("Error in bulk action:", err);
      alert("Failed to perform bulk action. Please try again.");
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleApproveAll = async () => {
    const pendingImages = images.filter(img => img.status === "PENDING");

    if (pendingImages.length === 0) {
      alert("No pending images to approve.");
      return;
    }

    if (!confirm(`Are you sure you want to approve all ${pendingImages.length} pending images?`)) {
      return;
    }

    try {
      setBulkProcessing(true);
      const updates = pendingImages.map(img =>
        axiosInstance.patch(`/api/gallery/images/review/${img.id}`, { status: "APPROVED" })
      );

      await Promise.all(updates);

      // Update local state
      setImages(images.map(img =>
        img.status === "PENDING" ? { ...img, status: "APPROVED" } : img
      ));

      alert(`Successfully approved ${pendingImages.length} images.`);
    } catch (err) {
      console.error("Error approving all images:", err);
      alert("Failed to approve all images. Please try again.");
    } finally {
      setBulkProcessing(false);
    }
  };

  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const selectAllVisibleImages = () => {
    const allImageIds = images.map(img => img.id);
    setSelectedImages(new Set(allImageIds));
  };

  const clearSelection = () => {
    setSelectedImages(new Set());
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedImages(new Set());
    }
  };

  const handleNoteChange = (imageId, note) => {
    setReviewNote(prev => ({
      ...prev,
      [imageId]: note
    }));
  };

  const openFullscreen = (image) => {
    if (selectMode) {
      toggleImageSelection(image.id);
      return;
    }
    const index = images.findIndex(img => img.id === image.id);
    setCurrentImageIndex(index);
    setFullscreenImage(image);
    setShowDetails(false);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setShowNoteEditor({});
    setShowDetails(false);
  };

  const navigateToNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setFullscreenImage(images[nextIndex]);
      setShowNoteEditor({});
    }
  };

  const navigateToPreviousImage = () => {
    if (currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setFullscreenImage(images[prevIndex]);
      setShowNoteEditor({});
    }
  };

  const toggleNoteEditor = (imageId) => {
    setShowNoteEditor(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
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

  const pendingCount = images.filter(img => img.status === "PENDING").length;
  const selectedCount = selectedImages.size;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
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

      {/* Bulk Actions Bar */}
      {!loading && images.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSelectMode}
                className={`flex items-center px-3 py-2 rounded-md ${selectMode
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {selectMode ? <CheckSquare size={16} /> : <Square size={16} />}
                <span className="ml-2">{selectMode ? 'Exit Select' : 'Select Mode'}</span>
              </button>

              {selectMode && (
                <>
                  <button
                    onClick={selectAllVisibleImages}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Select All ({images.length})
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Clear Selection
                  </button>
                  {selectedCount > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedCount} selected
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {filter === "PENDING" && pendingCount > 0 && (
                <button
                  onClick={handleApproveAll}
                  disabled={bulkProcessing}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50"
                >
                  {bulkProcessing ? (
                    <Loader size={16} className="animate-spin mr-2" />
                  ) : (
                    <CheckCheck size={16} className="mr-2" />
                  )}
                  Approve All ({pendingCount})
                </button>
              )}

              {selectMode && selectedCount > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction("APPROVED")}
                    disabled={bulkProcessing}
                    className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50"
                  >
                    {bulkProcessing ? (
                      <Loader size={16} className="animate-spin mr-2" />
                    ) : (
                      <Check size={16} className="mr-2" />
                    )}
                    Approve Selected ({selectedCount})
                  </button>
                  <button
                    onClick={() => handleBulkAction("REJECTED")}
                    disabled={bulkProcessing}
                    className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md disabled:opacity-50"
                  >
                    {bulkProcessing ? (
                      <Loader size={16} className="animate-spin mr-2" />
                    ) : (
                      <XSquare size={16} className="mr-2" />
                    )}
                    Reject Selected ({selectedCount})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
                        className={`relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200 ${selectMode && selectedImages.has(image.id)
                          ? 'ring-4 ring-blue-500'
                          : ''
                          }`}
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

                        {/* Selection Indicator */}
                        {selectMode && (
                          <div className="absolute top-2 left-2">
                            <div className={`rounded-full p-1 ${selectedImages.has(image.id)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white bg-opacity-80 text-gray-600'
                              }`}>
                              {selectedImages.has(image.id) ? (
                                <Check size={16} />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className={`absolute ${selectMode ? 'top-2 right-2' : 'top-2 right-2'}`}>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(image.status)}`}>
                            {getStatusIcon(image.status, 12)}
                            <span className="ml-1">{image.status}</span>
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        {!selectMode && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                            <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200">
                              <button className="bg-white text-gray-800 rounded-full p-2">
                                <Eye size={20} />
                              </button>
                            </div>
                          </div>
                        )}
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
        <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black bg-opacity-90 z-50 flex flex-col">
          {/* Top Bar */}
          <div className="bg-black bg-opacity-60 p-4 flex justify-between items-center">
            <div className="text-white font-medium">
              {currentImageIndex + 1} of {images.length}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDetails}
                className={`p-2 rounded-full ${showDetails ? 'bg-blue-500' : 'bg-black bg-opacity-50 hover:bg-opacity-70'}`}
              >
                <Info size={20} className="text-white" />
              </button>
              <button
                onClick={closeFullscreen}
                className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white"
              >
                <Close size={20} />
              </button>
            </div>
          </div>

          {/* Image Area with Navigation */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={`http://localhost:5002${fullscreenImage.fileUrl}`}
                alt={fullscreenImage.filename}
                className="max-w-96 max-h-96 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              {currentImageIndex > 0 && (
                <button
                  onClick={navigateToPreviousImage}
                  className="p-3 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-r-full ml-2"
                >
                  <ChevronLeft size={28} className="text-white" />
                </button>
              )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={navigateToNextImage}
                  className="p-3 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-l-full mr-2"
                >
                  <ChevronRight size={28} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className={`bg-white transition-all duration-300 ease-in-out ${showDetails || showNoteEditor[fullscreenImage.id] ? 'h-auto' : 'h-auto'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
              {/* Status Badge */}
              <div className="mb-2 sm:mb-0">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(fullscreenImage.status)}`}>
                  {getStatusIcon(fullscreenImage.status)}
                  <span className="ml-1">{fullscreenImage.status}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {fullscreenImage.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleReviewAction(fullscreenImage.id, "REJECTED")}
                      disabled={submitting[fullscreenImage.id]}
                      className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center flex-grow sm:flex-grow-0"
                    >
                      {submitting[fullscreenImage.id] ? (
                        <Loader size={16} className="animate-spin mr-1" />
                      ) : (
                        <X size={16} className="mr-1" />
                      )}
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleReviewAction(fullscreenImage.id, "APPROVED")}
                      disabled={submitting[fullscreenImage.id]}
                      className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center flex-grow sm:flex-grow-0"
                    >
                      {submitting[fullscreenImage.id] ? (
                        <Loader size={16} className="animate-spin mr-1" />
                      ) : (
                        <Check size={16} className="mr-1" />
                      )}
                      <span>Approve</span>
                    </button>
                  </>
                )}

                {/* Add Note Button (always visible) */}
                <button
                  onClick={() => toggleNoteEditor(fullscreenImage.id)}
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center flex-grow sm:flex-grow-0"
                >
                  <MessageSquare size={16} className="mr-1" />
                  {(fullscreenImage.reviewNote || reviewNote[fullscreenImage.id]) ? "Edit Note" : "Add Note"}
                </button>
              </div>
            </div>

            {/* Expandable Details Section */}
            {showDetails && (
              <div className="p-4 border-t">
                <h3 className="font-medium text-gray-800 mb-2">{fullscreenImage.filename}</h3>
                <div className="text-sm text-gray-600 mb-4">
                  <p>Uploaded: {formatDate(fullscreenImage.uploadedAt)}</p>
                </div>

                {/* Review Note Display */}
                {(fullscreenImage.reviewNote || reviewNote[fullscreenImage.id]) && !showNoteEditor[fullscreenImage.id] && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-700">Review Note:</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border text-sm">
                      {reviewNote[fullscreenImage.id] || fullscreenImage.reviewNote}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Note Editor */}
            {showNoteEditor[fullscreenImage.id] && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Review Note:</h4>
                <textarea
                  value={reviewNote[fullscreenImage.id] !== undefined ? reviewNote[fullscreenImage.id] : fullscreenImage.reviewNote || ""}
                  onChange={(e) => handleNoteChange(fullscreenImage.id, e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  rows="4"
                  placeholder="Add review notes..."
                ></textarea>

                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => toggleNoteEditor(fullscreenImage.id)}
                    className="py-1 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleReviewAction(fullscreenImage.id, fullscreenImage.status, reviewNote[fullscreenImage.id]);
                      toggleNoteEditor(fullscreenImage.id);
                    }}
                    disabled={submitting[fullscreenImage.id]}
                    className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center"
                  >
                    {submitting[fullscreenImage.id] ? (
                      <Loader size={12} className="animate-spin mr-1" />
                    ) : (
                      <Save size={12} className="mr-1" />
                    )}
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
