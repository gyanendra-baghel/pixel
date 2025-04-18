import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import imageRoutes from "./routes/imageRoutes.js";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, '../thumbnails')));

// Routes
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Image Service running on port ${PORT}`);
});
