# Use a Node.js base image
FROM node:18-alpine as base

# Set the working directory inside the container
WORKDIR /app
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the project source code
COPY . .

# Build the project
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]