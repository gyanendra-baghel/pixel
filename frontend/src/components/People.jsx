import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import photos from "../data/Photos";

const PersonGroup = ({ name, photoCount, images }) => {
  const navigate = useNavigate();

  const handleClick = (photo) => {
    navigate("/fullimage", { state: { photo } });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-500">{photoCount} photos</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.slice(0, 3).map((photo, index) => (
          <div key={index} className="aspect-square rounded overflow-hidden">
            <img
              src={photo.url}
              alt={`Photo of ${name}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleClick(photo)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const People = () => {
  const people = photos.reduce((acc, photo) => {
    if (!acc[photo.author]) {
      acc[photo.author] = [];
    }
    acc[photo.author].push(photo);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">People</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(people).map(([author, images]) => (
          <PersonGroup key={author} name={author} photoCount={images.length} images={images} />
        ))}
      </div>
    </div>
  );
};

export default People;
