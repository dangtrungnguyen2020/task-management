# Stage 1: Build the React application
# We use an official Node.js image as the builder.
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files.
# This step is done separately to leverage Docker's layer caching.
COPY package*.json ./

# Install the dependencies.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the application for production.
# The `npm run build` command creates a `build` folder with the static files.
RUN npm run build

# Stage 2: Serve the application with a lightweight Nginx server
# We use a small Nginx image for the final production container.
FROM nginx:stable-alpine

# Remove the default Nginx configuration file.
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file into the container.
# This file is essential for handling client-side routing in React.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static build files from the builder stage into Nginx's public directory.
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to the outside world.
EXPOSE 80

# The default command to run when the container starts.
# Nginx will serve the application.
CMD ["nginx", "-g", "daemon off;"]
