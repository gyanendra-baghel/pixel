import prisma from '../config/prismaClient.js';
import { producer } from "../config/kafka.js"

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

    await producer.send({
      topic: "new-gallery-img",
      messages: [{
        value: JSON.stringify({
          image_path: req.files.image.original_url,
          image_id: image.id,
          gallery_id: galleryId
        })
      }]
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


export const searchImages = async (req, res) => {
  try {
    const { caption, galleryId } = req.query;

    console.log("Caption", caption);
    console.log("Gallery Id", galleryId)

    // At least one filter must be provided
    if (!caption || !galleryId) {
      return res.status(400).json({
        error: "caption and galleryId are required."
      });
    }

    const images = await prisma.image.findMany({
      where: {
        // Filter by caption (partial match, case-insensitive)
        caption: {
          contains: caption,
          mode: 'insensitive',
        },
        // Filter by galleryId (exact match)
        // ...(galleryId && { galleryId }),
        // status: 'APPROVED',
      },
    });

    res.json(images);
  } catch (error) {
    console.error("Error searching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const addCaptionToImage = async (req, res) => {
  try {
    const { image_id, caption } = req.body;

    console.log("Addded Caption", image_id);
    console.log("Caption:", caption);

    // Validate input
    if (!caption) {
      return res.status(400).json({ error: "Caption is required in the request body." });
    }

    // Update the caption in the database
    const updatedImage = await prisma.image.update({
      where: { id: image_id },
      data: { caption },
    });

    res.json(updatedImage);
  } catch (error) {
    console.error("Error updating caption:", error);

    // Handle "not found" errors
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Image not found." });
    }

    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    await prisma.image.delete({
      where: { id: imageId },
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
