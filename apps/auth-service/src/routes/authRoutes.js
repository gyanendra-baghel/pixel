import express from "express";
import { deleteUser, forgetPassword, getUser, login, register, resetPassword } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticateToken, getUser);
router.get('/forget-password', forgetPassword);
router.get('/reset-password', resetPassword);
router.delete('/delete', authenticateToken, deleteUser);
router.get('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

export default router;
