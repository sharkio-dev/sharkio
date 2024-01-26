# Stage 1: Building the app
FROM node:lts as base

WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM base as prod

# Expose port 80
EXPOSE 3000

# Start Nginx and keep it running in the foreground
CMD ["npm", "run", "serve", "--host 0.0.0.0", "--no-open"]

