import prisma from '../config/prismaClient.js';

export const submitImage = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('No request body provided');
    }
    const { galleryId } = req.body;

    const image = await prisma.image.create({
      data: {
        galleryId: galleryId,
        filename: req.files.image.name,
        fileUrl: req.files.image.original_url,
        uploadedBy: req.user.id,
        status: 'PENDING',
      },
    });

    res.status(201).json(image);
  } catch (err) {
    console.error('Error submitting image:', err);
    res.status(500).json({ error: 'Image submission failed', detail: err.message });
  }
};

export const reviewImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "PENDING", "REJECTED"].includes(status)) {
      throw new Error("Invalid Status")
    }

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
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
    const { status } = req.query;

    const where = {
      galleryId
    };

    if (["APPROVED", "PENDING", "REJECTED"].includes(status)) {
      where.status = status;
    }

    const images = await prisma.image.findMany({
      where
    });

    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};

export const getUploadedImages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: 'Unauthenticated!' });
    }
    const userId = req.user.id;

    const images = await prisma.image.findMany({
      where: {
        uploadedBy: userId,
      },
    });

    res.json(images);
  } catch (err) {
    console.error('Error fetching uploaded images:', err);
    res.status(500).json({ error: 'Failed to fetch uploaded images' });
  }
}
