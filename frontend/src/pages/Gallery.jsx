import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Upload, Loader, AlertCircle, ImageIcon } from "lucide-react";
import axiosInstance from "../utils/api";

import GalleryHeader from "../components/gallery/GalleryHeader";
import SearchBar from "../components/gallery/SearchBar";
import ImageGroups from "../components/gallery/ImageGroups";
import ImageModal from "../components/gallery/ImageModel";
import EmptyState from "../components/gallery/EmptyState";
import LoadingState from "../components/gallery/LoadingState";
import ShareImageModal from "../components/ShareImageModal";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [textQuery, setTextQuery] = useState(searchParams.get("q") || "");

  // Fetch gallery images and info
  useEffect(() => {
    if (galleryId) {
      fetchGalleryData();
    }
  }, [galleryId]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);

      // Fetch gallery info
      const infoResponse = await axiosInstance.get(`/api/gallery/${galleryId}`);
      setGalleryInfo(infoResponse.data);
      setGalleryInfo(infoResponse.data);

      // Fetch images
      const imagesResponse = await axiosInstance.get(`/api/gallery/images/${galleryId}?status=APPROVED`);
      setImages(imagesResponse.data);
      setFilteredImages(imagesResponse.data);

      setError(null);

    } catch (err) {
      console.error("Error fetching gallery data:", err);
      setError("Failed to load gallery data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Apply search from URL params on initial load
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && images.length > 0) {
      setTextQuery(query);
      handleTextSearch(query);
    }
  }, [images, searchParams]);

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

  // Text search handler
  const handleTextSearch = async (query = textQuery) => {
    if (!query.trim()) {
      setFilteredImages(images);
      setIsSearching(false);
      setSearchParams({});
      return;
    }
    setError(null)
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
  const handleImageSearch = async (file) => {
    if (!file) return;

    setSearchLoading(true);
    setIsSearching(true);
    setError(null)

    const formData = new FormData();
    formData.append('file', file);
    formData.append("gallery_id", galleryId);

    try {
      // add gallery_id constrain
      const response = await axiosInstance.post(`/api/face/search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const results = response.data.results;

      if (results.error) {
        setError("No face in image")
        setSearchResults(null);
      } else {
        setFilteredImages(results.matches);
        setSearchResults({
          type: 'image',
          query: file.name,
          count: results.matches.length
        });

        // Clear text search when using image search
        setTextQuery("");
        setSearchParams({});
      }
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
  };

  // Handle sharing image
  const shareImage = () => {
    setShowShareModal(true);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState message="Loading gallery..." />;
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center my-8">
          <AlertCircle size={24} className="mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <EmptyState
          title="No images available"
          message="This gallery doesn't have any images yet."
          icon={<ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />}
          actionLink={`/gallery/${galleryId}/upload`}
          actionText="Upload Images"
          actionIcon={<Upload size={18} />}
        />
      );
    }

    if (searchLoading) {
      return <LoadingState message="Searching..." />;
    }

    if (filteredImages.length === 0 && isSearching) {
      return (
        <EmptyState
          title="No search results"
          message="No matching images found. Try a different search term."
          icon={<AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />}
          actionHandler={clearSearch}
          actionText="Clear Search"
        />
      );
    }

    return (
      <ImageGroups
        images={filteredImages.length > 0 ? filteredImages : images}
        onImageClick={openImageModal}
      />
    );
  };


  return (
    <div className="max-w-full mx-auto px-2 sm:px-3">
      {galleryInfo && (
        <GalleryHeader
          galleryInfo={galleryInfo}
          galleryId={galleryId}
        />
      )}

      <SearchBar
        textQuery={textQuery}
        onTextQueryChange={setTextQuery}
        onTextSearch={handleTextSearch}
        onImageSearch={handleImageSearch}
        onClearSearch={clearSearch}
        isSearching={isSearching}
        searchResults={searchResults}
        searchLoading={searchLoading}
      />

      {renderContent()}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={closeImageModal}
          onPrev={prevImage}
          onNext={nextImage}
          onShare={shareImage}
          hasPrev={currentImageIndex > 0}
          hasNext={currentImageIndex < (filteredImages.length > 0 ? filteredImages : images).length - 1}
        />
      )}

      {selectedImage && (
        <ShareImageModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageUrl={selectedImage.fileUrl}
          imageName={selectedImage.filename}
        />
      )}
    </div>
  );
}
