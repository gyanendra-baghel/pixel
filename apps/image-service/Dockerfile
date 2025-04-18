# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose port (e.g., 5002)
EXPOSE 5002

# Start the service
CMD ["npm", "start"]
