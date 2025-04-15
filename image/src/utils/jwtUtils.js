import jwt from "jsonwebtoken";
import { getEnv } from "./getEnv.js";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    getEnv("JWT_SECRET"),
    { expiresIn: "7d" }
  );
};
