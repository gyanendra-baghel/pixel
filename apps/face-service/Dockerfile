FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for dlib and face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake
    # libgtk-3-dev \
    # libboost-all-dev \
    # && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y netcat-openbsd

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8010 

COPY wait-for-kafka.sh /wait-for-kafka.sh
RUN chmod +x /wait-for-kafka.sh
ENTRYPOINT ["/wait-for-kafka.sh"]
CMD ["python", "-u", "main.py"]
