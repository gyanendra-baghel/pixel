import express from "express";
import { getBulkUser, getUser } from "../controllers/userController.js";

const router = express.Router();

router.post('/', getUser);
router.post('/bulk', getBulkUser);

export default router;
