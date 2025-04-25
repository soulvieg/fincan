FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all frontend files
COPY . ./

# Ensure images are copied to build directory
RUN mkdir -p /app/build/img
RUN cp -r /app/public/img/* /app/build/img/ || true

# Build the app
RUN npm run build

# Debug: List contents of /app to verify build folder exists
RUN ls -la /app

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]