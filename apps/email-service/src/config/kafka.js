const { Kafka } = require('kafkajs');
const getEnv = require("../utils/getEnv");

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: [getEnv("KAFKA_BROKER") || 'localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'email-consumer-group' });

module.exports = { kafka, producer, consumer };
