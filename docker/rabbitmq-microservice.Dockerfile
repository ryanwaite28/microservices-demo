FROM node:alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

RUN npm run build

ARG MICROSERVICE_APP

CMD [ "node" , "dist/microservices/" , MICROSERVICE_APP ]