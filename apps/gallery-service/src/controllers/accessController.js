import prisma from '../config/prismaClient.js';
import axios from "axios"

export const grantAccess = async (req, res) => {
  try {
    const { userEmail, galleryId } = req.body;

    const access = await prisma.userAccess.create({
      data: {
        userEmail: userEmail,
        galleryId: galleryId,
      },
    });

    res.status(201).json(access);
  } catch (err) {
    res.status(500).json({ error: 'Failed to grant access', detail: err.message });
  }
};

export const grantAccessBulk = async (req, res) => {
  try {
    const { userEmails, galleryId } = req.body; // Expecting an array of emails

    if (!Array.isArray(userEmails) || !galleryId) {
      return res.status(400).json({ error: 'userEmails must be an array and galleryId is required' });
    }

    // Fetch users to verify which emails exist
    let foundEmails = [];
    let missingEmails = [];
    try {
      const response = await axios.post("http://auth-service:5001/api/auth/user/bulk", {
        emails: userEmails
      });
      // console.log("Response from auth service:", response.data);
      const { foundUsers } = response.data;
      foundEmails = foundUsers.map((u) => u.email);
      missingEmails = response.data.missingEmails;
    } catch (error) {
      throw new Error("Auth service is not reachable");
    }

    // Grant access only to found emails
    const createdAccesses = await Promise.all(
      foundEmails.map((email) =>
        prisma.userAccess.create({
          data: {
            email,
            galleryId,
          },
        })
      )
    );

    res.status(201).json({
      success: true,
      granted: createdAccesses.map((a) => a.userEmail),
      missing: missingEmails,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to grant access',
      detail: err.message,
    });
  }
};

export const revokeAccess = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID required' });
  }

  try {
    const access = await prisma.userAccess.deleteMany({
      where: {
        id
      },
    });

    res.status(200).json(access);
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke access', detail: err.message });
  }
}

export const getUserAccessGalleries = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userEmail = req.user.email;

  if (req.user.role.toUpperCase() == "ADMIN") {
    const galleries = await prisma.gallery.findMany();
    return res.json(galleries);
  }

  const where = { email: userEmail };

  // Check if access is valid
  const { access } = req.query;
  if (access == "uploader") {
    where.canUpload = true;
  } else if (access == "viewer") {
    where.canView = true;
  }

  const accesses = await prisma.userAccess.findMany({
    where,
    include: { gallery: true },
  });

  res.json(accesses.map(a => a.gallery));
};

export const getGalleryAccessUser = async (req, res) => {
  const galleryId = req.params.galleryId;
  if (!galleryId) {
    return res.status(400).json({ error: 'Gallery ID is required' });
  }
  const access = await prisma.userAccess.findMany({
    where: {
      galleryId: galleryId,
    },
  });

  return res.status(200).json(access.map(a => a));
}



export const handleUploadAccess = async (req, res) => {
  const { email, galleryId, canUpload } = req.body;
  if (!email || !galleryId || canUpload === undefined) {
    return res.status(400).json({ error: 'Email and Gallery ID and canUpload are required' });
  }

  const access = await prisma.userAccess.update({
    where: {
      email_galleryId: {
        email: "user1@gmail.com",
        galleryId: "edf34a77-324f-407d-b609-3e27c412814c"
      }
    },
    data: {
      canUpload,
    },
  });

  res.status(200).json(access);
}
