const { consumer } = require('../config/kafka');
const emailService = require('./emailService');

const TOPIC_NAME = 'email-topic';

const consumeEmails = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const emailData = JSON.parse(message.value.toString());
        console.log(`📥 Processing email: ${JSON.stringify(emailData)}`);

        try {
          await emailService.sendEmail(emailData);
          // Kafka handles message offsets internally, no need to ack manually
        } catch (error) {
          console.error("❌ Failed to process email:", error);
          // Optionally implement retry or dead-letter handling here
        }
      },
    });

    console.log(`✅ Email Worker listening on Kafka topic: ${TOPIC_NAME}`);
  } catch (error) {
    console.error("❌ Error in consuming emails:", error);
  }
};

module.exports = { consumeEmails };
