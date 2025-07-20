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

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Invalid format credentials' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const token = jwt.sign({ id: user.id }, getEnv("JWT_SECRET"), { expiresIn: '1h' });
  const link = `${getEnv("FRONTEND_URL")}/reset-password/${token}`;
  console.log(link);
  // TODO: send email with link
  res.json({ message: 'Reset password link sent to your email', link });
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Invalid format credentials' });
  }

  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET"));
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
}

export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Invalid format credentials' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email, password: hashedPassword }
  });

  res.json({ message: 'User updated successfully', user });
};

export const deleteUser = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Invalid format credentials' });
  }

  await prisma.user.delete({ where: { id: userId } });

  res.json({ message: 'User deleted successfully' });
}

