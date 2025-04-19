# Use official Node.js image from Docker Hub
FROM node:16

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose port for the application
EXPOSE 5000

# Command to run the app
CMD ["node", "src/app.js"]
