import prisma from '../config/prismaClient.js';

export const uploadImage = async (userId, galleryId, filename, fileUrl) => {
  return await prisma.image.create({
    data: {
      filename,
      fileUrl,
      uploadedBy: userId,
      galleryId
    }
  });
};

export const reviewImage = async (adminId, imageId, status, note) => {
  return await prisma.image.update({
    where: { id: imageId },
    data: {
      status,
      reviewNote: note,
      reviewedAt: new Date(),
      reviewedBy: adminId
    }
  });
};

export const getPendingImages = async () => {
  return await prisma.image.findMany({ where: { status: 'PENDING' } });
};
