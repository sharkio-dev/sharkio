FROM node:latest
ENV NODE_ENV production

WORKDIR /app
COPY /dist .
RUN npm i -g http-server

EXPOSE 8080

CMD ["http-server"]