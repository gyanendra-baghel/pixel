import prisma from '../config/prismaClient.js';

export const createGallery = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name } = req.body;
    const gallery = await prisma.gallery.create({
      data: { name, createdBy: req.user.id },
    });
    res.status(201).json(gallery);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create gallery', detail: err.message });
  }
};

export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
      where: { createdBy: req.user.id },
    });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
};

export const getGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await prisma.gallery.findUnique({
      where: { id },
    });
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.gallery.delete({ where: { id } });
    res.json({ message: 'Gallery deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
};
