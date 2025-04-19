import prisma from '../config/prismaClient.js';

export const submitImage = async (req, res) => {
  try {
    const { galleryId, storagePath } = req.body;

    const image = await prisma.image.create({
      data: {
        galleryId: parseInt(galleryId),
        storagePath,
        uploadedById: req.user.id,
        status: 'PENDING',
      },
    });

    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ error: 'Image submission failed', detail: err.message });
  }
};

export const reviewImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { status } = req.body;

    const updatedImage = await prisma.image.update({
      where: { id: parseInt(imageId) },
      data: { status },
    });

    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to review image' });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const { galleryId } = req.params;

    const images = await prisma.image.findMany({
      where: { galleryId: parseInt(galleryId), status: 'APPROVED' },
    });

    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};
