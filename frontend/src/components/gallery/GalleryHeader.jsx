import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';

function GalleryHeader({ galleryInfo, galleryId }) {
  if (!galleryInfo) {
    return <h1>No Gallery Details</h1>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{galleryInfo.name}</h1>
          {galleryInfo.description && (
            <p className="text-gray-600 mt-1 max-w-3xl">{galleryInfo.description}</p>
          )}
        </div>
        {/* <Link
          to={`/gallery/${galleryId}/upload`}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Upload size={18} />
          Upload
        </Link> */}
      </div>
    </div>
  );
}

export default GalleryHeader;
