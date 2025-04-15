import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faBackward, faXmark, faCopy } from "@fortawesome/free-solid-svg-icons";
import { LinkedinShareButton, WhatsappShareButton, TwitterShareButton } from "react-share";

import linkedinLogo from "../assets/linkedin.png";
import xLogo from "../assets/twitter.png";
import waLogo from "../assets/whatsapp.png";

const FullImage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const photo = location.state?.photo;

  const [isShare, setIsShare] = useState(false);
  const toggle = () => setIsShare(!isShare);

  if (!photo) {
    return <p>First upload an image, then open!</p>;
  }

  
  const shareUrl = `${window.location.origin}${photo.url}`;

  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Image link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="full-image-container">
      <FontAwesomeIcon
        onClick={() => navigate(-1)}
        icon={faBackward}
        className="text-2xl pl-11 text-blue-500 cursor-pointer"
      />
      <FontAwesomeIcon
        icon={faArrowUpFromBracket}
        onClick={toggle}
        className="text-2xl ml-6 text-blue-500 cursor-pointer"
      />

      {isShare && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-0 sm:w-96">
            
            <FontAwesomeIcon 
              icon={faXmark}  
              onClick={toggle}
              className="absolute top-2 left-2 text-xl cursor-pointer"
            />

       
            <div className="flex flex-col pt-5 items-center">
              <LinkedinShareButton url={shareUrl}>
                <img src={linkedinLogo} alt="LinkedIn" className="w-12 h-12" />
              </LinkedinShareButton>
              <p className="text-sm font-medium">LinkedIn</p>
            </div>

        
            <div className="flex flex-col pt-5 items-center">
              <TwitterShareButton url={shareUrl} title="Check out this image!">
                <img src={xLogo} alt="X" className="w-12 h-12" />
              </TwitterShareButton>
              <p className="text-sm font-medium">X</p>
            </div>

          
            <div className="flex flex-col pt-5 items-center">
              <WhatsappShareButton url={shareUrl} title="Check out this image!">
                <img src={waLogo} alt="WhatsApp" className="w-12 h-12" />
              </WhatsappShareButton>
              <p className="text-sm font-medium">WhatsApp</p>
            </div>

           
            <div className="flex flex-col pt-5 items-center">
              <button onClick={copyToClipboard} className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300">
                <FontAwesomeIcon icon={faCopy} className="text-lg" />
              </button>
              <p className="text-sm font-medium">Copy Link</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <h1 className="font-bold text-4xl">{photo.dateAdded}</h1>
      </div>

      <div className="flex justify-center">
        <img
          src={photo.url}
          alt={photo.title}
          className="h-[530px] object-cover"
        />
      </div>
    </div>
  );
};

export default FullImage;
