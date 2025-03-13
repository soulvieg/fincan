# Use an official Node.js image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# If your app listens on port 3001 (for example), expose it
EXPOSE 3001

# Optionally set NODE_ENV to production
ENV NODE_ENV=production

# Run your backend (for example, if you start your server with `node server.js`)
CMD ["node", "server.js"]