import { useState, useEffect } from "react";
import { Eye, EyeOff, Filter, Check, X, Loader, MessageSquare, Save } from "lucide-react";
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

  // Fetch images on component mount and when filter changes
  useEffect(() => {
    fetchImages();
  }, [filter]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
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

      // Replace with your actual API endpoint
      await axiosInstance.patch(`/api/gallery/images/review/${imageId}`,
        {
          status,
          reviewNote: note || reviewNote[imageId] || ""
        }
      );

      // Update local state to reflect the change
      setImages(images.filter(img => img.id !== imageId));

      // Clear review note for this image
      setReviewNote(prev => {
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

  return (
    <div className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-1/3">
                  <img
                    src={`http://localhost:5002${image.fileUrl}`}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full 
                      ${image.status === "APPROVED" ? "bg-green-100 text-green-800" :
                        image.status === "REJECTED" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"}`}>
                      {image.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800 truncate" title={image.filename}>
                        {image.filename}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {formatDate(image.uploadedAt)}
                      </p>
                    </div>

                    <div className={`flex items-center ${image.status === "APPROVED" ? "text-green-500" :
                      image.status === "REJECTED" ? "text-red-500" :
                        "text-yellow-500"}`}>
                      {image.status === "APPROVED" ? <Eye size={20} /> :
                        image.status === "REJECTED" ? <EyeOff size={20} /> :
                          <MessageSquare size={20} />}
                    </div>
                  </div>

                  {/* Review Note Input */}
                  <div className="mt-3">
                    <label htmlFor={`note-${image.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Review Note:
                    </label>
                    <textarea
                      id={`note-${image.id}`}
                      value={reviewNote[image.id] !== undefined ? reviewNote[image.id] : image.reviewNote || ""}
                      onChange={(e) => handleNoteChange(image.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      rows="2"
                      placeholder="Add a note for the uploader..."
                    ></textarea>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    {image.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleReviewAction(image.id, "REJECTED")}
                          disabled={submitting[image.id]}
                          className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-600 hover:bg-red-200 flex items-center"
                        >
                          {submitting[image.id] ? (
                            <Loader size={14} className="animate-spin mr-1" />
                          ) : (
                            <X size={14} className="mr-1" />
                          )}
                          Reject
                        </button>

                        <button
                          onClick={() => handleReviewAction(image.id, "APPROVED")}
                          disabled={submitting[image.id]}
                          className="px-3 py-1 rounded-md text-sm bg-green-100 text-green-600 hover:bg-green-200 flex items-center"
                        >
                          {submitting[image.id] ? (
                            <Loader size={14} className="animate-spin mr-1" />
                          ) : (
                            <Check size={14} className="mr-1" />
                          )}
                          Approve
                        </button>
                      </>
                    )}

                    {image.status !== "PENDING" && reviewNote[image.id] !== undefined && (
                      <button
                        onClick={() => handleReviewAction(image.id, image.status)}
                        disabled={submitting[image.id]}
                        className="px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center"
                      >
                        {submitting[image.id] ? (
                          <Loader size={14} className="animate-spin mr-1" />
                        ) : (
                          <Save size={14} className="mr-1" />
                        )}
                        Update Note
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
