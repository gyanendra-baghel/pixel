import { useNavigate } from "react-router-dom";
import { Tag } from "lucide-react";
import photos from "../data/Photos";

const ObjectCategory = ({ category, images }) => {
  const navigate = useNavigate();

  const handleClick = (photo) => {
    navigate("/fullimage", { state: { photo } });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="text-lg font-medium p-4">{category}</h3>
      <div className="grid grid-cols-3 gap-2 p-2">
        {images.map((photo, index) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleClick(photo)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Objects = () => {
  const categorizedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.category]) {
      acc[photo.category] = [];
    }
    acc[photo.category].push(photo);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Objects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categorizedPhotos).map(([category, images]) => (
          <ObjectCategory key={category} category={category} images={images} />
        ))}
      </div>

    </div>
  );
};

export default Objects;
