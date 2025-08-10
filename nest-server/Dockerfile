# Stage 1: Build the NestJS application.
# We use a Node.js image with development dependencies.
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files first.
# This allows Docker to cache the 'npm install' step.
COPY package*.json ./

# Install project dependencies.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Run the NestJS build command to compile TypeScript to JavaScript.
# The compiled files will be in the 'dist' directory.
RUN npm run build

# Stage 2: Create the final production image.
# We use a clean, lightweight Node.js image.
FROM node:20-alpine

# Set the working directory.
WORKDIR /app

# Copy only the necessary package.json files from the builder stage.
COPY --from=builder /app/package*.json ./

# Install only production dependencies.
# This keeps the final image size small.
RUN npm install --omit=dev

# Copy the compiled application code from the builder stage.
# We only need the 'dist' folder.
COPY --from=builder /app/dist ./dist

# Expose the default port for a NestJS application.
# Make sure this matches the port your app is configured to listen on.
EXPOSE 4000

# The command to start the application.
# This runs the compiled JavaScript file.
CMD ["node", "dist/main"]

