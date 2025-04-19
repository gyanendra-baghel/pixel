import express from 'express';
import { createGallery, getAllGalleries, deleteGallery } from '../controllers/galleryController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRole(['ADMIN']), createGallery);
router.get('/', authenticateUser, getAllGalleries);
router.delete('/:id', authenticateUser, authorizeRole(['ADMIN']), deleteGallery);

export default router;
