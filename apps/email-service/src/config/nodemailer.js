const nodemailer = require('nodemailer');
const getEnv = require("../utils/getEnv");

const transporter = nodemailer.createTransport({
  host: getEnv("SMTP_HOST", 'smtp.gmail.com'),
  port: getEnv("SMTP_PORT", 587),
  secure: false,
  auth: {
    user: getEnv("SMTP_USER"),
    pass: getEnv("SMTP_PASS")
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transporter Error:", error);
  } else {
    console.log("✅ Email Service Ready");
  }
});

module.exports = transporter;
