# Use the official Node.js image with a supported version
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the app directory
COPY app/package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY app/ ./

# Build the Next.js application
RUN npm run build

# Use Node.js as the final image
FROM node:18 AS export

# Create a directory for the shared volume
RUN mkdir -p /frontend_build

# Copy built files from the build stage
COPY --from=build /app/.next /frontend_build/.next

# Set the volume to be used by Nginx
VOLUME /frontend_build

# You can also expose the port if needed
EXPOSE 3000
