import { useState } from "react";
import {
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Link2,
  Check,
  X
} from "lucide-react";

export default function ShareImageModal({ isOpen, onClose, imageUrl, imageName }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("social");

  // Prepare the absolute URL for sharing
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `http://localhost:5002${imageUrl}`;

  // Prepare encoded parameters for sharing
  const encodedUrl = encodeURIComponent(absoluteImageUrl);
  const encodedTitle = encodeURIComponent(`Check out this image: ${imageName || "Shared image"}`);

  // Share URLs for different platforms
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    // Instagram doesn't support direct URL sharing through web API
    // typically requires the mobile app, so we'll just show a message
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(absoluteImageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle sharing to a specific platform
  const shareToSocial = (platform) => {
    if (platform === "instagram") {
      alert("To share on Instagram, please download the image and upload it through the Instagram app.");
      return;
    }

    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h3 className="text-lg font-medium flex items-center">
            <Share2 size={20} className="mr-2 text-gray-600" />
            Share Image
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'social'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'link'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('link')}
          >
            Copy Link
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'social' ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Facebook */}
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
              >
                <Facebook size={24} />
                <span className="font-medium">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg transition-colors"
              >
                <Twitter size={24} />
                <span className="font-medium">Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg transition-colors"
              >
                <Linkedin size={24} />
                <span className="font-medium">LinkedIn</span>
              </button>

              {/* Instagram */}
              <button
                onClick={() => shareToSocial('instagram')}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 hover:from-pink-600 hover:via-purple-600 hover:to-yellow-600 text-white p-3 rounded-lg transition-colors"
              >
                <Instagram size={24} />
                <span className="font-medium">Instagram</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Copy the direct link to share this image anywhere:
              </p>

              <div className="flex">
                <input
                  type="text"
                  value={absoluteImageUrl}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 flex items-center justify-center ${copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } rounded-r-md transition-colors`}
                >
                  {copied ? <Check size={18} /> : <Link2 size={18} />}
                </button>
              </div>

              {copied && (
                <p className="text-green-600 text-sm flex items-center">
                  <Check size={16} className="mr-1" />
                  Link copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
