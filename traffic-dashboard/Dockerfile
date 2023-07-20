FROM node:latest as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:latest
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/dist .
RUN npm i -g http-server
EXPOSE 8080
CMD ["http-server"]