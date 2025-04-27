import express from "express";
import cors from "cors";
// import helmet from "helmet";
import { prisma } from "./config/prisma.js";
import { getEnv } from "./utils/getEnv.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import errorMiddleware from "./utils/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // optional, useful if you're sending cookies or auth headers
}));
// app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Auth service is running" });
});
app.use('/api/auth', authRoutes);
app.use('/api/auth/user', userRoutes);

// Middleware
app.use(errorMiddleware);

prisma.$connect().then(() => {
  app.listen(getEnv("PORT"), () => {
    console.log(`Auth service running on port ${getEnv("PORT")}`);
  });
}).catch((err) => {
  console.error("Prisma connection error:", err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});

