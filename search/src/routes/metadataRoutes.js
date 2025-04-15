import express from "express";
import { extractMetadata } from "../controllers/searchController.js";
import { indexImage, searchImages } from "../controllers/searchController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/extract", authenticateUser, extractMetadata);
router.post("/index/:id", authenticateUser, indexImage);
router.get("/search", authenticateUser, searchImages);

export default router;
