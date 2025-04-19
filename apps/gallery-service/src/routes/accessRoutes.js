import express from 'express';
import { grantAccess, getUserAccessGalleries } from '../controllers/accessController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/grant', authenticateUser, authorizeRole(['ADMIN']), grantAccess);
router.get('/my-galleries', authenticateUser, getUserAccessGalleries);

export default router;
