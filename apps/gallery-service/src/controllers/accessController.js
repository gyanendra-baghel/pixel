import prisma from '../config/prismaClient.js';

export const grantAccess = async (req, res) => {
  try {
    const { userId, galleryId } = req.body;

    const access = await prisma.galleryAccess.create({
      data: {
        userId: userId,
        galleryId: galleryId,
      },
    });

    res.status(201).json(access);
  } catch (err) {
    res.status(500).json({ error: 'Failed to grant access', detail: err.message });
  }
};

export const getUserAccessGalleries = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.id;

    if (req.user.role.toUpperCase() == "ADMIN") {
      const galleries = await prisma.gallery.findMany();
      return res.json(galleries);
    }

    const accesses = await prisma.galleryAccess.findMany({
      where: { userId },
      include: { gallery: true },
    });

    res.json(accesses.map(a => a.gallery));

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user access galleries' });
  }
};
