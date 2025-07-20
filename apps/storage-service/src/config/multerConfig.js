import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id; // Make sure req.user is populated (e.g., via auth middleware)
    const userDir = '/uploads/' + userId.toString();

    // Create directory if it doesn't exist
    fs.mkdirSync(userDir, { recursive: true });

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only JPG, PNG, WebP allowed.'));
  }
};

// File Size Limit (5MB)
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

