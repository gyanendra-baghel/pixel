import jwt from "jsonwebtoken";
import { getEnv } from "../utils/getEnv.js";

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided!" });
  }

  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET"));
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authenticateUser;
