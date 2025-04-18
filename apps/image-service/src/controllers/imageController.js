import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Upload Image
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = req.user.id;

  const originalPath = req.file.path;
  const filename = path.basename(originalPath);
  const thumbnailPath = `thumbnails/${userId}/${filename}`;

  try {
    // Generate Thumbnail (200x200)
    await sharp(originalPath)
      .resize(200, 200)
      .toFile(thumbnailPath);

    res.json({
      message: 'Image uploaded successfully',
      original: `/uploads/${userId}/${filename}`,
      thumbnail: `/thumbnails/${userId}/${filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
};

// Get Uploaded Image
export const getImage = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.user.id;

  const imagePath = path.join(__dirname, `../../uploads/${userId}`, req.params.filename);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
};

// Get Thumbnail
export const getThumbnail = (req, res) => {
  const thumbnailPath = path.join(__dirname, '../../thumbnails', req.params.filename);
  if (fs.existsSync(thumbnailPath)) {
    res.sendFile(thumbnailPath);
  } else {
    res.status(404).json({ message: 'Thumbnail not found' });
  }
};

// Transform Image
export const transformImage = async (req, res) => {
  const { filename } = req.params;
  const { width, height, format, quality } = req.query;
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = req.user.id;

  const imagePath = path.join(__dirname, `../../uploads/${userId}`, filename);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  try {
    let transformer = sharp(imagePath);

    // Resize if width or height is provided
    if (width || height) {
      transformer = transformer.resize(
        width ? parseInt(width) : null,
        height ? parseInt(height) : null
      );
    }

    // Convert format if needed
    if (format) {
      if (format === 'jpeg') {
        transformer = transformer.jpeg({ quality: quality ? parseInt(quality) : 80 });
        res.set('Content-Type', 'image/jpeg');
      } else if (format === 'png') {
        transformer = transformer.png({ quality: quality ? parseInt(quality) : 80 });
        res.set('Content-Type', 'image/png');
      } else if (format === 'webp') {
        transformer = transformer.webp({ quality: quality ? parseInt(quality) : 80 });
        res.set('Content-Type', 'image/webp');
      } else {
        return res.status(400).json({ message: 'Unsupported format' });
      }
    }

    // Pipe the transformed image directly to response
    transformer.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error transforming image', error: error.message });
  }
};

