# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install bash in Alpine Linux
RUN apk add --no-cache bash

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Copy the wait-for-it.sh script and make it executable
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose port and set environment
EXPOSE 5001
ENV NODE_ENV=production

# Use wait-for-it to pause startup until MySQL is ready on db:3306, then start the server
CMD ["./wait-for-it.sh", "db:3306", "--", "node", "server.js"]