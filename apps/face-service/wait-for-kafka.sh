#!/bin/bash

set -e

# Kafka host and port
KAFKA_HOST=kafka
KAFKA_PORT=9092

# Wait for Kafka to be available
echo "Waiting for Kafka to be available at $KAFKA_HOST:$KAFKA_PORT..."

# Loop until Kafka is available
until nc -z -v -w30 $KAFKA_HOST $KAFKA_PORT; do
  echo "Kafka is unavailable - sleeping"
  sleep 5
done

echo "Kafka is up!"
echo "🚀 Starting app... $@"
exec "$@"
