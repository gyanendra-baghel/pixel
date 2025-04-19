import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());

// 📦 Proxy helper
const createServiceProxy = (target) => createProxyMiddleware({
  target,
  changeOrigin: true,
  timeout: 5000,
});

// 🔄 Proxy routes
app.use('/api/auth', createServiceProxy('http://auth-service:5001/api/auth'));
app.use('/api/storage', createServiceProxy('http://storage-service:5002/api/storage'));
app.use('/api/gallery', createServiceProxy('http://gallery-service:5003/api/gallery'));

// 🚨 Fallback Error Handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({ message: 'Internal Gateway Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔀 Gateway running at http://localhost:${PORT}`);
});
