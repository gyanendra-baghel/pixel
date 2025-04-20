import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Tag, ImageIcon, Loader, AlertCircle } from "lucide-react";
import axiosInstance from "../utils/api";

export default function GalleryPage() {
  const { galleryId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryInfo, setGalleryInfo] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axiosInstance.get(`/api/gallery/images/${galleryId}`);
        setImages(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch gallery info
    const fetchGalleryInfo = async () => {
      try {
        const response = await axiosInstance.get(`/api/gallery/${galleryId}`);
        setGalleryInfo(response.data);
      } catch (err) {
        console.error("Error fetching gallery info:", err);
      }
    };

    if (galleryId) {
      fetchGalleryImages();
      fetchGalleryInfo();
    }
  }, [galleryId]);

  // Get all unique statuses
  const allStatuses = Array.from(new Set(images.map((img) => img.status)));

  // Filter images by selected status
  const filteredImages = selectedStatus
    ? images.filter((img) => img.status === selectedStatus)
    : images;

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Gallery title */}
      {galleryInfo && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{galleryInfo.name}</h1>
            <Link to={`/gallery/${galleryId}/upload`}>Upload</Link>
          </div>
          {galleryInfo.description && (
            <p className="text-gray-600 mt-1">{galleryInfo.description}</p>
          )}
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-3 py-1 text-sm rounded-full ${selectedStatus === null
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            All
          </button>

          {allStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 text-sm rounded-full flex items-center ${selectedStatus === status
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <Tag size={14} className="mr-1" />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin mr-2" size={24} />
          <span>Loading images...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No images available in this gallery</p>
          <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
            Upload Images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={`http://localhost:5002${image.fileUrl}`}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg";
                  }}
                />
                {/* <div className="absolute top-2 right-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(image.status)}`}>
                    {image.status}
                  </span>
                </div> */}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 truncate" title={image.filename}>
                  {image.filename}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded: {formatDate(image.uploadedAt)}
                </p>
                {image.reviewNote && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <p className="font-medium text-gray-700">Review Note:</p>
                    <p className="text-gray-600">{image.reviewNote}</p>
                  </div>
                )}
                {image.reviewedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed on {formatDate(image.reviewedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
