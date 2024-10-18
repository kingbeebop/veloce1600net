# Use the official Node.js image with a supported version
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the app directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY ./ ./

# Build the Next.js application
RUN npm run build

# Use Node.js as the final image
FROM node:20 AS export

# Set the working directory again
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/.next /app/.next

# Copy package.json from the build stage to the export stage
COPY --from=build /app/package*.json ./

# Install production dependencies again (if needed)
RUN npm install --production

# Start the Next.js application
CMD ["npm", "start"]
