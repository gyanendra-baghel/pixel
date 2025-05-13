const express = require('express');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/email', emailRoutes);

module.exports = app;
