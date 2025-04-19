import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());


// 🧠 Route to Auth Service
app.use('/api/auth', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://auth-service:5001${req.originalUrl}`,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || '',
      },
      timeout: 5000, // ms
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Auth Route Error:', err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// 🧠 Route to Upload Service
app.use('/api/images', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://image-service:5002${req.originalUrl}`,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || '',
      },
      timeout: 5000, // ms
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Upload Route Error:', err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// 🛡 Global Error Handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({ message: 'Internal Gateway Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔀 Gateway running at http://localhost:${PORT}`);
});
