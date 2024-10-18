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

# Copy built files to the final image
# We won't use Nginx here, so we'll just keep the files for Nginx to serve later
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public

# The final image will be built by the main Nginx service
