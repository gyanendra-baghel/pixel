import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from "lucide-react";
import { formatDate, downloadImage } from "../../lib/utils";

export default function ImageModal({
  image,
  onClose,
  onPrev,
  onNext,
  onShare,
  hasPrev,
  hasNext
}) {
  return (
    <div className="fixed inset-0 top-0 left-0 bg-black bg-opacity-95 h-screen w-screen z-50 flex justify-center items-center">
      <div className="relative w-full h-full flex flex-col justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Navigation buttons */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Image container */}
        <div className="relative max-w-6xl mx-auto flex flex-col items-center justify-center">
          <div className="flex-1 flex items-center max-h-[80%] justify-center p-4">
            <img
              src={`http://localhost:5002${image.fileUrl}`}
              alt={image.filename}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Image info and action buttons */}
          <div className="bg-black bg-opacity-70 p-4 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-white">
                <h3 className="font-medium text-lg">{image.filename}</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Uploaded: {formatDate(image.uploadedAt)}
                </p>
                {image.reviewNote && (
                  <p className="text-gray-300 text-sm mt-2 bg-gray-800 bg-opacity-50 p-2 rounded">
                    <span className="font-medium">Note:</span> {image.reviewNote}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadImage(image)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md transition-colors text-sm"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={onShare}
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
  );
}
