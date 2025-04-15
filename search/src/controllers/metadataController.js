import prisma from "../config/prismaClient.js";
import sharp from "sharp";
import ExifParser from "exif-parser";
import fs from "fs";
import esClient from "../config/elasticsearch.js";

// Extract metadata
export const extractMetadata = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const userId = req.user.id; // From JWT middleware
  const filePath = req.file.path;
  const filename = req.file.originalname;

  try {
    // Read image buffer
    const imageBuffer = fs.readFileSync(filePath);
    const parser = ExifParser.create(imageBuffer);
    const exifData = parser.parse();
    const metadata = await sharp(filePath).metadata();

    const imageMetadata = await prisma.imageMetadata.create({
      data: {
        userId,
        filename,
        path: filePath,
        width: metadata.width,
        height: metadata.height,
        cameraModel: exifData.tags?.Make || null,
        location: exifData.tags?.GPSLatitude ? `${exifData.tags.GPSLatitude},${exifData.tags.GPSLongitude}` : null,
        tags: [], // AI-generated tags (can be added later)
      },
    });

    res.json({ message: "Metadata extracted", metadata: imageMetadata });
  } catch (error) {
    res.status(500).json({ message: "Error extracting metadata", error: error.message });
  }
};
