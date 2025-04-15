import React from "react";
import Photos from "../data/Photos";

const SharedAlbum = () => {
  const firstPhoto = Photos.length > 0 ? Photos[0] : null;

  return (
    <div className="flex flex-col items-center p-6">
      {/* Heading */}
      <h1 className="font-bold text-3xl absolute left-80">Shared Photos</h1>
      
      {/* Photo Display Section */}
      <div className="flex flex-col items-center p-4 rounded-lg mt-16">
        {firstPhoto ? (
          <>
            <img
              src={firstPhoto.url}
              alt={firstPhoto.name || "Shared Photo"}
              className="w-64 h-64 object-cover rounded-lg"
            />
            <p className="mt-2 text-gray-700 font-semibold">
              shivangtrivadi@gmail.com
            </p>
          </>
        ) : (
          <p className="text-gray-500">No photos available</p>
        )}
      </div>
    </div>
  );
};

export default SharedAlbum;
