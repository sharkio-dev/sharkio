FROM node:latest
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm i -g nodemon concurrently ts-node swagger-jsdoc

COPY /dist .

EXPOSE 8080

CMD [ "npm", "run", "prod"]