import express from 'express';
import { submitImage, reviewImage, getGalleryImages } from '../controllers/imageController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, submitImage);
router.get('/:galleryId', authenticateUser, getGalleryImages);
router.patch('/review/:imageId', authenticateUser, authorizeRole(['ADMIN']), reviewImage);

export default router;
