FROM node:latest

WORKDIR /app

COPY /dist .
COPY package*.json ./
RUN npm install

EXPOSE 5173

CMD [ "npm", "run", "prod"]