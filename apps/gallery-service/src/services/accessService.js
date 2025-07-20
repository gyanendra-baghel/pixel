import prisma from '../config/prismaClient.js';

export const grantAccess = async (userId, galleryId, canUpload = false, canView = true) => {
  return await prisma.userAccess.upsert({
    where: {
      userId_galleryId: { userId, galleryId }
    },
    update: {
      canUpload,
      canView
    },
    create: {
      userId,
      galleryId,
      canUpload,
      canView
    }
  });
};

export const checkAccess = async (userId, galleryId) => {
  return await prisma.userAccess.findUnique({
    where: {
      userId_galleryId: { userId, galleryId }
    }
  });
};
