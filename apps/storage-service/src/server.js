import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes.js";
import { getImage } from "./controllers/imageController.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/storage', imageRoutes);
app.get('/:userId/:filename', getImage);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Image Service running on port ${PORT}`);
});
