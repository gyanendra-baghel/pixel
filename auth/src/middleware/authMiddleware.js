import jwt from "jsonwebtoken";
import { getEnv } from "../utils/getEnv.js";

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, getEnv("JWT_SECRET"), (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

