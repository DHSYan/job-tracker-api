# Use the official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port (default Express port)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

