import esClient from "../config/elasticsearch.js";
import prisma from "../config/prismaClient.js";

// Index Image in Elasticsearch
export const indexImage = async (req, res) => {
  const { id } = req.params; // Image ID

  try {
    const image = await prisma.imageMetadata.findUnique({ where: { id } });
    if (!image) return res.status(404).json({ message: "Image not found" });

    await esClient.index({
      index: "images",
      id: image.id,
      body: {
        userId: image.userId,
        filename: image.filename,
        path: image.path,
        uploadDate: image.uploadDate,
        width: image.width,
        height: image.height,
        cameraModel: image.cameraModel,
        location: image.location,
        tags: image.tags,
      },
    });

    await prisma.imageMetadata.update({ where: { id }, data: { indexed: true } });

    res.json({ message: "Image indexed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error indexing image", error: error.message });
  }
};

// Search Images
export const searchImages = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Search query is required" });

  try {
    const result = await esClient.search({
      index: "images",
      query: {
        multi_match: {
          query,
          fields: ["filename", "tags", "cameraModel", "location"],
        },
      },
    });

    const hits = result.hits.hits.map(hit => hit._source);
    res.json({ results: hits });
  } catch (error) {
    res.status(500).json({ message: "Error searching images", error: error.message });
  }
};
