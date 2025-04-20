import axios from "axios";
import FormData from "form-data";

async function uploadToStorageService(file, authToken) {
  const form = new FormData();
  form.append("image", file.data, {
    filename: file.name,
    contentType: file.mimetype,
  });

  const response = await axios.post("http://storage-service:5002/api/storage/upload", form, {
    headers: {
      ...form.getHeaders(),
      "Content-Type": `multipart/form-data`,
      "Authorization": authToken,
    }
  });

  if (response.status !== 200) {
    throw new Error("Failed to upload image");
  }

  return response.data;
}

export const imageUploadMiddleware = (fieldName) => async (req, res, next) => {
  const file = req.files[fieldName];
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const authToken = req.header('Authorization');
  if (!authToken) return res.status(401).json({ error: "Auth token not provided in upload" });

  try {
    const result = await uploadToStorageService(file, authToken);
    req.files[fieldName].original_url = result.original; // attach to req object
    next(); // pass to next middleware or route handler
  } catch (err) {
    console.error("Upload to storage failed:", err.message);
    return res.status(500).json({ error: "Upload to storage failed" });
  }
};
