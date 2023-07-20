


FROM node:latest AS builder
ENV NODE_ENV production
# Add a work directory
# RUN npm run build

WORKDIR /app
COPY /dist .
RUN npm i -g http-server

EXPOSE 8080

CMD ["http-server"]