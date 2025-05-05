import express from 'express';
import { submitImage, reviewImage, getGalleryImages, getUploadedImages, searchImages, addCaptionToImage } from '../controllers/imageController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { imageUploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, imageUploadMiddleware("image"), submitImage);
router.get('/uploads', authenticateUser, getUploadedImages);
router.get('/search', authenticateUser, searchImages);
router.patch('/review/:imageId', authenticateUser, authorizeRole(['ADMIN']), reviewImage);
router.get('/:galleryId', authenticateUser, getGalleryImages);
router.post('/:id/caption', addCaptionToImage);

export default router;
