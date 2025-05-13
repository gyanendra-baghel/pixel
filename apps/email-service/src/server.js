const app = require('./app');
const getEnv = require("./utils/getEnv")
const { consumeEmails } = require('./services/queueService');

const PORT = getEnv("PORT");

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Connect to RabbitMQ & Start Email Consumer
  consumeEmails();
});
