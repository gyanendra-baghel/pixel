const { consumeEmails } = require('../services/queueService');

(async () => {
  try {
    await consumeEmails();
  } catch (error) {
    console.error('❌ Failed to start email consumer:', error);
    process.exit(1);
  }
})();
