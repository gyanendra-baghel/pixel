import prisma from '../config/prismaClient.js';

export const createGallery = async (req, res) => {
  try {
    const { name } = req.body;
    const gallery = await prisma.gallery.create({
      data: { name, createdById: req.user.id },
    });
    res.status(201).json(gallery);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create gallery', detail: err.message });
  }
};

export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany();
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.gallery.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Gallery deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
};
