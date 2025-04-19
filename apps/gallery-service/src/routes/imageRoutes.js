import express from 'express';
import { submitImage, reviewImage, getGalleryImages } from '../controllers/imageController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticate, submitImage);
router.get('/:galleryId', authenticate, getGalleryImages);
router.patch('/review/:imageId', authenticate, authorizeRole(['ADMIN']), reviewImage);

export default router;
