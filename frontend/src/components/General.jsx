import { useState } from "react";
import photos from "../data/Photos.js";
import { useNavigate } from "react-router-dom";

function General({ isGap, isSidebarOpen }) {
  const navigate = useNavigate();

  const handleClick = (photo) => {
    navigate("/fullimage", { state: { photo } });
  };

  return (
    <div className={`pt-12 sm:pt-14 md:pt-16 px-4 sm:px-6 transition-all duration-300 ${isSidebarOpen ? "ml-64 md:ml-0" : ""}`}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Gallery</h2>
      <div
        className={`grid ${isSidebarOpen ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 "
          } ${isGap ? "gap-[3px] sm:gap-[5px]" : "gap-0"}`}
      >
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer rounded-md"
              onClick={() => handleClick(photo)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default General;

