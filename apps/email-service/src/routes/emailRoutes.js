const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-email', emailController.sendEmail);
router.post('/send-users-email', emailController.sendMultiUsersEmail);

module.exports = router;
