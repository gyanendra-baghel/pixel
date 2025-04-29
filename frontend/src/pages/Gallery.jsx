import { useState, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Download, Share2, Heart, X, Loader, AlertCircle, ImageIcon, Upload,
  ChevronLeft, ChevronRight, Calendar, Search, Camera, Filter, XCircle
} from "lucide-react";
import axiosInstance from "../utils/api";

export default function GalleryPage() {
  const { galleryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [galleryInfo, setGalleryInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Search states
  const [textQuery, setTextQuery] = useState(searchParams.get("q") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/gallery/images/${galleryId}?status=APPROVED`);
        setImages(response.data);
        setFilteredImages(response.data);
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

  // Apply search from URL params on initial load
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && images.length > 0) {
      setTextQuery(query);
      handleTextSearch(query);
    }
  }, [images, searchParams]);

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

  // Get date for grouping (just YYYY-MM-DD)
  const getDateGroup = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Open image in full view modal
  const openImageModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Navigate to previous image in modal
  const prevImage = () => {
    const imagesArray = filteredImages.length > 0 ? filteredImages : images;
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(imagesArray[currentImageIndex - 1]);
    }
  };

  // Navigate to next image in modal
  const nextImage = () => {
    const imagesArray = filteredImages.length > 0 ? filteredImages : images;
    if (currentImageIndex < imagesArray.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(imagesArray[currentImageIndex + 1]);
    }
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === "Escape") closeImageModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentImageIndex, filteredImages]);

  // Download image
  const downloadImage = (image) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5002${image.fileUrl}`;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share image (copy link to clipboard)
  const shareImage = (image) => {
    const url = `http://localhost:5002${image.fileUrl}`;
    navigator.clipboard.writeText(url);
    alert("Image link copied to clipboard!");
  };

  // Text search handler
  const handleTextSearch = async (query = textQuery) => {
    if (!query.trim()) {
      setFilteredImages(images);
      setIsSearching(false);
      setSearchParams({});
      return;
    }

    setSearchLoading(true);
    setIsSearching(true);

    try {
      const response = await axiosInstance.get(`/api/gallery/images/search?caption=${encodeURIComponent(query)}&galleryId=${galleryId}`);
      setFilteredImages(response.data);
      setSearchResults({
        type: 'text',
        query: query,
        count: response.data.length
      });

      // Update URL with search query
      setSearchParams({ q: query });
    } catch (err) {
      console.error("Error searching gallery:", err);
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle image search (upload)
  const handleImageSearch = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSearchLoading(true);
    setIsSearching(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosInstance.post(`/api/gallery/${galleryId}/search/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFilteredImages(response.data);
      setSearchResults({
        type: 'image',
        query: file.name,
        count: response.data.length
      });

      // Clear text search when using image search
      setTextQuery("");
      setSearchParams({});
    } catch (err) {
      console.error("Error searching by image:", err);
      setError("Image search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setTextQuery("");
    setFilteredImages(images);
    setIsSearching(false);
    setSearchResults(null);
    setSearchParams({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Group images by date
  const groupImagesByDate = () => {
    const groups = {};
    const imagesArray = filteredImages.length > 0 ? filteredImages : images;

    imagesArray.forEach(image => {
      const dateGroup = getDateGroup(image.uploadedAt);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(image);
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, images]) => ({
        date,
        displayDate: formatDate(date),
        images
      }));
  };

  const imageGroups = groupImagesByDate();

  return (
    <div className="max-w-full mx-auto px-2 sm:px-3">
      {/* Gallery header */}
      {galleryInfo && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{galleryInfo.name}</h1>
              {galleryInfo.description && (
                <p className="text-gray-600 mt-1 max-w-3xl">{galleryInfo.description}</p>
              )}
            </div>
            <Link
              to={`/gallery/${galleryId}/upload`}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              <Upload size={18} />
              Upload
            </Link>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Text search */}
          <div className="flex flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="Search gallery"
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {textQuery && (
              <button
                onClick={() => setTextQuery("")}
                className="absolute inset-y-0 right-10 flex items-center pr-3"
              >
                <XCircle size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <button
              onClick={() => handleTextSearch()}
              disabled={searchLoading}
              className="absolute right-0 top-0 bottom-0 px-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              {searchLoading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>

          {/* Image search */}
          <div className="flex">
            <label
              htmlFor="image-search"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer transition-colors"
            >
              <Camera size={18} />
              <span>Search by Image</span>
              <input
                id="image-search"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSearch}
              />
            </label>
          </div>

          {/* Clear search */}
          {isSearching && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              <X size={18} />
              Clear Search
            </button>
          )}
        </div>

        {/* Search results info */}
        {searchResults && (
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <Filter size={16} className="mr-2" />
            {searchResults.type === 'text' ? (
              <span>Found <strong>{searchResults.count}</strong> {searchResults.count === 1 ? 'result' : 'results'} for "<strong>{searchResults.query}</strong>"</span>
            ) : (
              <span>Found <strong>{searchResults.count}</strong> {searchResults.count === 1 ? 'image' : 'images'} similar to "<strong>{searchResults.query}</strong>"</span>
            )}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader className="animate-spin mr-2" size={24} />
          <span className="text-gray-600 font-medium">Loading gallery...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center my-8">
          <AlertCircle size={24} className="mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No images available</h3>
          <p className="text-gray-500 mt-2 mb-6">This gallery doesn't have any images yet.</p>
          <Link
            to={`/gallery/${galleryId}/upload`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
          >
            <Upload size={18} />
            Upload Images
          </Link>
        </div>
      ) : searchLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader className="animate-spin mr-2" size={24} />
          <span className="text-gray-600 font-medium">Searching...</span>
        </div>
      ) : filteredImages.length === 0 && isSearching ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No search results</h3>
          <p className="text-gray-500 mt-2 mb-6">No matching images found. Try a different search term.</p>
          <button
            onClick={clearSearch}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
          >
            <X size={18} />
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Date-grouped image sections */}
          <div className="space-y-8">
            {imageGroups.map(group => (
              <div key={group.date} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex items-center gap-2 bg-gray-50 p-3 border-b">
                  <Calendar size={18} className="text-gray-500" />
                  <h2 className="font-medium text-gray-700">{group.displayDate}</h2>
                  <span className="text-sm text-gray-500 ml-2">({group.images.length} images)</span>
                </div>

                {/* Ultra-responsive grid: 2-6 columns based on screen size */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-1 p-1">
                  {group.images.map((image, index) => {
                    // Find the actual index in the filtered images array
                    const globalIndex = (filteredImages.length > 0 ? filteredImages : images).findIndex(img => img.id === image.id);

                    return (
                      <div
                        key={image.id}
                        className="aspect-square relative overflow-hidden cursor-pointer"
                        onClick={() => openImageModal(image, globalIndex)}
                      >
                        <img
                          src={`http://localhost:5002${image.fileUrl}`}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Image modal */}
          {selectedImage && (
            <div className="fixed inset-0 top-0 left-0 bg-black bg-opacity-95 z-50 flex justify-center items-center">
              <div className="relative w-full h-full flex flex-col justify-center">
                {/* Close button */}
                <button
                  onClick={closeImageModal}
                  className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors z-10"
                >
                  <X size={24} />
                </button>

                {/* Navigation buttons */}
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-colors"
                  >
                    <ChevronLeft size={28} />
                  </button>
                )}
                {currentImageIndex < (filteredImages.length > 0 ? filteredImages : images).length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-colors"
                  >
                    <ChevronRight size={28} />
                  </button>
                )}

                {/* Image container */}
                <div className="relative max-w-6xl mx-auto h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-4">
                    <img
                      src={`http://localhost:5002${selectedImage.fileUrl}`}
                      alt={selectedImage.filename}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {/* Image info and action buttons */}
                  <div className="bg-black bg-opacity-70 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-white">
                        <h3 className="font-medium text-lg">{selectedImage.filename}</h3>
                        <p className="text-gray-300 text-sm mt-1">
                          Uploaded: {formatDate(selectedImage.uploadedAt)}
                        </p>
                        {selectedImage.reviewNote && (
                          <p className="text-gray-300 text-sm mt-2 bg-gray-800 bg-opacity-50 p-2 rounded">
                            <span className="font-medium">Note:</span> {selectedImage.reviewNote}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadImage(selectedImage)}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md transition-colors text-sm"
                        >
                          <Download size={16} />
                          Download
                        </button>
                        <button
                          onClick={() => shareImage(selectedImage)}
                          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md transition-colors text-sm"
                        >
                          <Share2 size={16} />
                          Share
                        </button>
                        <button
                          className="flex items-center gap-2 bg-transparent border border-gray-500 hover:border-white text-white px-3 py-2 rounded-md transition-colors text-sm"
                        >
                          <Heart size={16} />
                          Like
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
