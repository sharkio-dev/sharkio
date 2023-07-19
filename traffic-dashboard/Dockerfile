# FROM node:latest as builder

# WORKDIR /app

# COPY /dist .
# COPY package*.json ./
# RUN npm install

# RUN npm ci
# RUN npm run build

# FROM nginx:1.23.1-alpine
# EXPOSE 5173
# COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app /usr/share/nginx/html


FROM node:latest AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
COPY /dist .
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --production
# Copy app files

# hosting

# Bundle static assets with nginx
FROM nginx:1.23-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app /usr/share/nginx/html
# Add your nginx.conf
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 5173
# Start nginx
CMD ["nginx", "-g", "daemon off;"]