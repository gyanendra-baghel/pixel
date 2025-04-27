import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { getEnv } from "../utils/getEnv.js"

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !["ADMIN", "USER", "UPLOADER"].includes(role)) {
    return res.status(400).json({ message: 'Invalid format credentials' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role }
  });

  res.status(201).json({ message: 'User registered successfully', user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid format credentials' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, getEnv("JWT_SECRET"), { expiresIn: '3h' });

  res.json({ message: 'Signin successful', token, role: user.role });
};


export const getUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new Error('User not found');
  }
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, role: true }
  });

  if (!userData) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(userData);
}
