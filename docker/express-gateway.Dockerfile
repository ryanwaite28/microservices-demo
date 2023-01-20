FROM node:alpine

WORKDIR /app

COPY package*.json /app

RUN npm install -g nodemon

RUN npm install

COPY . .

RUN pwd
RUN ls -al

RUN npm run build

EXPOSE 80

ARG GATEWAY_APP

CMD [ "nodemon" , "dist/gateways/" , GATEWAY_APP ]