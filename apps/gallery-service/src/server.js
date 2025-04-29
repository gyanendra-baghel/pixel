import express from 'express';
import cors from 'cors';
import galleryRoutes from './routes/galleryRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import accessRoutes from './routes/accessRoutes.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import { getEnv } from './utils/getEnv.js';
import prisma from './config/prismaClient.js';
import fileUpload from 'express-fileupload';

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(fileUpload());

// Routes
app.use('/api/gallery', authenticateUser, galleryRoutes);
app.use('/api/gallery/images/search', authenticateUser, imageRoutes);
app.use('/api/gallery/access', authenticateUser, accessRoutes);

// Global error handler for unhandled routes or errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

prisma.$connect().then(() => {
  app.listen(getEnv("PORT"), () => {
    console.log(`Gallery service running on port ${getEnv("PORT")}`);
  });
}).catch((err) => {
  console.error("Prisma connection error:", err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
