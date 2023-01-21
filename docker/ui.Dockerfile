FROM node:alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package.json /app
RUN npm install

COPY ui /app/ui
COPY package.json /app
COPY package.json /app/ui

EXPOSE 80



CMD [ "npm" , "run", "frontend" ]