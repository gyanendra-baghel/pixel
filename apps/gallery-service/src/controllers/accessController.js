import prisma from '../config/prismaClient.js';

export const grantAccess = async (req, res) => {
  try {
    const { userId, galleryId } = req.body;

    const access = await prisma.galleryAccess.create({
      data: {
        userId: parseInt(userId),
        galleryId: parseInt(galleryId),
      },
    });

    res.status(201).json(access);
  } catch (err) {
    res.status(500).json({ error: 'Failed to grant access', detail: err.message });
  }
};

export const getUserAccessGalleries = async (req, res) => {
  try {
    const userId = req.user.id;

    const accesses = await prisma.galleryAccess.findMany({
      where: { userId },
      include: { gallery: true },
    });

    res.json(accesses.map(a => a.gallery));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user access galleries' });
  }
};
