import express from 'express';
import { grantAccess, getUserAccessGalleries } from '../controllers/accessController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/grant', authenticate, authorizeRole(['ADMIN']), grantAccess);
router.get('/my-galleries', authenticate, getUserAccessGalleries);

export default router;
