import express from 'express';
import { grantAccess, getUserAccessGalleries, grantAccessBulk, getGalleryAccessUser, revokeAccess, handleUploadAccess } from '../controllers/accessController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/users/:galleryId', authenticateUser, authorizeRole(['ADMIN']), getGalleryAccessUser);
router.get('/my-galleries', authenticateUser, getUserAccessGalleries);

router.post('/grant', authenticateUser, authorizeRole(['ADMIN']), grantAccess);
router.post('/grant/bulk', authenticateUser, authorizeRole(['ADMIN']), grantAccessBulk);
router.delete('/revoke/:id', authenticateUser, authorizeRole(['ADMIN']), revokeAccess);

router.patch('/upload', authenticateUser, authorizeRole(['ADMIN']), handleUploadAccess);

export default router;
