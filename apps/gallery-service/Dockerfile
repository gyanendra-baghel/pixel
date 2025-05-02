# Use official Node.js image from Docker Hub
FROM node:18

RUN apt-get update && apt-get install -y netcat-openbsd

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose port for the application
EXPOSE 5003

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
