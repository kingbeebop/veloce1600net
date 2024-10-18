# Use the official Node.js image with a supported version
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lightweight image to hold built files
FROM alpine:latest as export

# Create a directory for the shared volume
RUN mkdir -p /frontend_build

# Copy built files from the build stage
COPY --from=build /app/.next /frontend_build/.next

# Optionally, copy other necessary files, like next.config.js, if applicable
COPY --from=build /app/next.config.js /frontend_build/next.config.js

# Set the volume to be used by Nginx
VOLUME /frontend_build
