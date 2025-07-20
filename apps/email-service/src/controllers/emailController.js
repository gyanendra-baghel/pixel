const emailService = require('../services/emailService');

const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing required fields (to, subject, text)" });
    }

    await emailService.enqueueEmail({ to, subject, text });

    return res.status(200).json({ message: "Email request received and queued for processing." });
  } catch (error) {
    console.error("❌ Error in sendEmail:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendMultiUsersEmail = async (req, res) => {
  try {
    const { emails, subject, text, html } = req.body;

    if (!emails || !subject || !text) {
      return res.status(400).json({ error: "Missing required fields (users, subject, text)" });
    }

    for (const email of emails) {
      await emailService.enqueueEmail({ to: email, subject, text, html });
    }

    return res.status(200).json({ message: "Email requests received and queued for processing." });
  } catch (error) {
    console.error("❌ Error in sendMultiUsersEmail:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = { sendEmail, sendMultiUsersEmail };
