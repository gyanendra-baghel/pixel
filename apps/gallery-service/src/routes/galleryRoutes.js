import express from 'express';
import { createGallery, getAllGalleries, deleteGallery } from '../controllers/galleryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole(['ADMIN']), createGallery);
router.get('/', authenticate, getAllGalleries);
router.delete('/:id', authenticate, authorizeRole(['ADMIN']), deleteGallery);

export default router;
