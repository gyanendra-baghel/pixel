import express from 'express';
import { submitImage, reviewImage, getGalleryImages, getUploadedImages, searchImages, addCaptionToImage, deleteImage } from '../controllers/imageController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { imageUploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, imageUploadMiddleware("image"), submitImage);
router.get('/uploads', authenticateUser, getUploadedImages);
router.get('/search', authenticateUser, searchImages);
router.post('/caption', addCaptionToImage);
router.patch('/review/:imageId', authenticateUser, authorizeRole(['ADMIN']), reviewImage);
router.get('/:galleryId', authenticateUser, getGalleryImages);
router.delete('/:imageId', authenticateUser, deleteImage);

export default router;
