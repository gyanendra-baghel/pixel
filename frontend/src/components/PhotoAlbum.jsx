import React from 'react';
import { Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import photos from '../data/Photos';

const PhotoCard = ({ title, count, coverImage, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
    <div className="relative aspect-square">
      <img
        src={coverImage}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center space-x-2">
          <Image className="w-5 h-5" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm opacity-90">{count} photos</p>
      </div>
    </div>
  </div>
);

const PhotoAlbums = () => {
  const navigate = useNavigate();


  const albumCategories = {};
  photos.forEach((photo) => {
    if (!albumCategories[photo.category]) {
      albumCategories[photo.category] = [];
    }
    albumCategories[photo.category].push(photo);
  });

  const albums = Object.keys(albumCategories).map((category) => ({
    title: category,
    count: albumCategories[category].length,
    coverImage: albumCategories[category][0]?.url,
    photos: albumCategories[category],
  }));

  return (
    <div className="p-6 flex-1">
      <h2 className="text-2xl font-semibold mb-6">Photo Albums</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album, index) => (
          <PhotoCard
            key={index}
            {...album}
            onClick={() => navigate('/fullimage', { state: { photos: album.photos } })}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoAlbums;
