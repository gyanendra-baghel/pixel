import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import metadataRoutes from "./routes/metadataRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/metadata", metadataRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Metadata Service running on port ${PORT}`));
