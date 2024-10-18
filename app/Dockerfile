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

# Use Nginx to serve the application
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy built files from the build stage
COPY --from=build /app/.next /usr/share/nginx/html/.next
COPY --from=build /app/public /usr/share/nginx/html/public

# Expose the port on which Nginx will run
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
