// src/components/ImageUpload.js
import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/api";

const ImageUpload = () => {
  const [image, setImage] = useState(null); // Store the image selected by the user
  const [previewUrl, setPreviewUrl] = useState(null); // Store image preview URL
  const [loading, setLoading] = useState(false); // Loading state for the upload
  const [message, setMessage] = useState(""); // To show upload status

  // Handle file selection
  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // Handle file upload
  const uploadImageHandler = async () => {
    if (!image) {
      setMessage("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear previous message

    const formData = new FormData();
    formData.append("image", image); // Add selected image to FormData
    formData.append("caption", "");

    try {
      // Replace the URL with your Django API endpoint for handling uploads
      const response = await axiosInstance.post("/api/images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      if (response.status === 200) {
        setMessage("Image uploaded successfully!");
      } else {
        setMessage("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={fileSelectedHandler} />
      {previewUrl && (
        <div>
          <h3>Image Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
        </div>
      )}
      <button onClick={uploadImageHandler} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUpload;
