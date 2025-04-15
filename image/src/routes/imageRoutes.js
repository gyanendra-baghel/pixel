import express from "express";
import { getImage, getThumbnail, transformImage, uploadImage } from "../controllers/imageController.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/upload', authenticateUser, uploadSingleImage, uploadImage);
router.get('/uploads/:filename', authenticateUser, getImage);
router.get('/transform/:filename', authenticateUser, transformImage);
router.get('/thumbnails/:filename', authenticateUser, getThumbnail);

export default router;
