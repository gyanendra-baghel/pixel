import React from "react";
import { Heart } from "lucide-react";
import photos from "../data/Photos";

const PhotoCard = ({ title, coverImage, isFavorite }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
    <div className="relative aspect-square">
      <img
        src={coverImage}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Heart icon positioned at the bottom-left */}
      <div className="absolute bottom-2 left-2">
        <Heart
          className={`w-7 h-7 drop-shadow-lg ${isFavorite ? "text-red-500 fill-red-500" : "text-white"
            }`}
        />
      </div>

      {/* Image Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-medium">{title}</h3>
      </div>
    </div>
  </div>
);

const Fev = () => {

  const favoriteImages = photos.filter((photo) => photo.heart);

  return (
    <div className="p-6 flex-1">
      <h2 className="text-2xl font-semibold mb-6">Favorites</h2>
      {favoriteImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteImages.map((photo, index) => (
            <PhotoCard
              key={index}

              coverImage={photo.url}
              isFavorite={photo.heart}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No favorite images found.</p>
      )}
    </div>
  );
};

export default Fev;

