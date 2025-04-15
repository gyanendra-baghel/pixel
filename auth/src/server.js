import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./config/prisma.js";
import { getEnv } from "./utils/getEnv.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(express.json());
app.use(cors({
  origin: getEnv("FRONTEND_URL"), // replace with your client URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // optional, useful if you're sending cookies or auth headers
}));
app.use(helmet());


console.log("Frontend URL:", getEnv("FRONTEND_URL"));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// prisma.$connect().then(() => {
app.listen(getEnv("PORT"), async () => {
  console.log(`Auth service running on port ${getEnv("PORT")}`);
});
// }).catch((error) => {
//   console.error('Error connecting to the database:', error);
//   process.exit(1);
// }).finally(() => {
//   prisma.$disconnect();
// });
