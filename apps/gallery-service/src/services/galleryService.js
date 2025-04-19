import { prisma } from '../prismaClient.js';

export const createGallery = async (userId, data) => {
  return await prisma.gallery.create({
    data: {
      name: data.name,
      description: data.description,
      createdBy: userId
    }
  });
};

export const getGalleryById = async (id) => {
  return await prisma.gallery.findUnique({
    where: { id },
    include: { images: true, accessList: true }
  });
};

export const getAllGalleries = async () => {
  return await prisma.gallery.findMany({ include: { images: true } });
};
