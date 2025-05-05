import { Kafka } from "kafkajs";
import { getEnv } from "../utils/getEnv.js"

const kafka = new Kafka({
  clientId: "uploader-service",
  brokers: [getEnv("KAFKA_BROKER")],
});

export const producer = kafka.producer();
await producer.connect();
