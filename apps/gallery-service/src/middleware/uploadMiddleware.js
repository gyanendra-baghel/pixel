import axios from "axios";
import FormData from "form-data";

async function uploadToStorageService(file, authToken) {
  const form = new FormData();
  form.append("image", file.data, {
    filename: file.name,
    contentType: file.mimetype,
  });

  const response = await axios.post("http://storage-service:5002/api/images/upload", form, {
    headers: {
      ...form.getHeaders(),
      "Content-Type": `multipart/form-data`,
      "Authorization": authToken,
    }
  });

  return response.data;
}

export const imageUploadMiddleware = (fieldName) => async (req, res, next) => {
  const file = req.files[fieldName];
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const authToken = req.headers("Authorization");
  if (!authToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await uploadToStorageService(file, authToken);
    req.imageUploadResult = result; // attach to req object
    next(); // pass to next middleware or route handler
  } catch (err) {
    console.error("Upload to storage failed:", err.message);
    return res.status(500).json({ error: "Upload to storage failed" });
  }
};
