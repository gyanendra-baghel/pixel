FROM python:3.10-slim

WORKDIR /app

# Prevent interactive prompts during package install
# ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies and clean up to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Preload the BLIP model from Hugging Face
RUN python -c "from transformers import BlipProcessor, BlipForConditionalGeneration; \
    BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base', use_fast=True); \
    BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base')"

COPY . .

EXPOSE 8010

COPY wait-for-kafka.sh /wait-for-kafka.sh
RUN chmod +x /wait-for-kafka.sh

# Optionally, define a health check
# HEALTHCHECK CMD curl --fail http://localhost:8010/health || exit 1

# Start script waits for Kafka then runs the app
ENTRYPOINT ["/wait-for-kafka.sh"]
CMD ["python", "-u", "main.py"]
