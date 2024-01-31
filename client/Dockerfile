FROM node:latest as builder

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23-alpine as production

ENV NODE_ENV production

WORKDIR /app

RUN apk add --update nodejs npm

COPY --from=builder /app/dynamic-env.js /app/dynamic-env.js
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules/dotenv /app/node_modules/dotenv
COPY --from=builder /app/dist /app/dist

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
# Expose port
EXPOSE 8080
# Start nginx
CMD ["sh", "-c", "ls && node './dynamic-env.js' ./dist/env.js && mv ./dist/env.js /usr/share/nginx/html && nginx -g 'daemon off;'"]
