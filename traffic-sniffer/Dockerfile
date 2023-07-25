FROM node:latest as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:latest
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/package.json .
RUN npm install
COPY --from=builder /app/dist .
EXPOSE 5012
CMD [ "npm", "run", "prod"]