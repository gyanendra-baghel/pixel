import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import galleryRoutes from './routes/galleryRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import accessRoutes from './routes/accessRoutes.js';
import { authenticate } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Routes
app.use('/api/galleries', authenticate, galleryRoutes);
app.use('/api/images', authenticate, imageRoutes);
app.use('/api/access', authenticate, accessRoutes);

// Global error handler for unhandled routes or errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
