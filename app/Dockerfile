# Use the official Node.js image with a supported version
FROM node:20 AS build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code into the working directory
COPY ./ ./

# Build the Next.js application
RUN npm run build

# Use Node.js as the final image for exporting the build
FROM node:20 AS export

# Create a directory for the shared volume that will hold the build artifacts
RUN mkdir -p /frontend_build

# Copy the .next build files from the build stage
COPY --from=build /app/.next /frontend_build/.next

# Set the volume to be used by Nginx or other services
VOLUME /frontend_build

# Expose the port if needed (for example, if you want to run the app directly from the container)
EXPOSE 3000