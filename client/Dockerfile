FROM node:latest as builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

RUN npm run build

FROM nginx:1.23-alpine as production

ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
# Expose port
EXPOSE 8080
# Start nginx
CMD ["nginx", "-g", "daemon off;"]