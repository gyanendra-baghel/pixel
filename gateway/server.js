import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());

// 🧠 JSON parsing middleware for APIs that need it
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// 📦 Proxy helper
const createServiceProxy = (target) => createProxyMiddleware({
  target,
  changeOrigin: true,
  // pathRewrite: {
  //   '^/api/auth': '',      // for auth-service
  //   '^/api/images': '',    // for image-service
  // },
  onProxyReq: (proxyReq, req, res) => {
    // Preserve raw body for multipart/form-data uploads
    if (req.body && !Buffer.isBuffer(req.body)) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
});

// 🔄 Proxy routes
app.use('/api/auth', createServiceProxy('http://auth-service:5001/api/auth'));
app.use('/api/images', createServiceProxy('http://image-service:5002/api/images'));

// 🚨 Fallback Error Handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({ message: 'Internal Gateway Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔀 Gateway running at http://localhost:${PORT}`);
});
