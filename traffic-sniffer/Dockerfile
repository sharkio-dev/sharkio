FROM node:latest

WORKDIR /app

COPY /dist .
COPY package*.json ./
RUN npm install

EXPOSE 5012

CMD [ "npm", "run", "prod"]