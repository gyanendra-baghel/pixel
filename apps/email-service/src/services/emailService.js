const transporter = require('../config/nodemailer');
const { producer } = require('../config/kafka');

const TOPIC_NAME = 'email-topic';

let producerReady = false;

const ensureProducerConnected = async () => {
  if (!producerReady) {
    await producer.connect();
    producerReady = true;
  }
};

const sendEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text
    });

    console.log(`📩 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Error in sending email:", error);
    throw error;
  }
};

const enqueueEmail = async (emailData) => {
  try {
    await ensureProducerConnected();

    await producer.send({
      topic: TOPIC_NAME,
      messages: [
        { value: JSON.stringify(emailData) }
      ]
    });

    console.log(`📤 Email request enqueued: ${JSON.stringify(emailData)}`);
  } catch (error) {
    console.error("❌ Error in enqueueing email:", error);
    throw error;
  }
};

module.exports = { sendEmail, enqueueEmail };
