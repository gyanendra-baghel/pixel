import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./config/prisma.js";
import { getEnv } from "./utils/getEnv.js";
import authRoutes from "./routes/authRoutes.js"
import errorMiddleware from "./utils/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: getEnv("FRONTEND_URL"), // replace with your client URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // optional, useful if you're sending cookies or auth headers
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Auth service is running");
});
app.use('/api/auth', authRoutes);

// Middleware
app.use(errorMiddleware);

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
