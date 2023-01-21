import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import rabbit from 'foo-foo-mq';

import * as RequestHandlers from './app.handler';




// connecting to message broker

const rabbitMqConfig: rabbit.ConfigurationOptions = {
  connection: {
    retryLimit: 2,
    replyTimeout: 20 * 1000,
    name: 'default',
    user: process.env.RABBIT_MQ_USER,
    pass: process.env.RABBIT_MQ_PASS,
    host: process.env.RABBIT_MQ_HOST,
    port: parseInt(process.env.RABBIT_MQ_PORT),
    // vhost: '%2f',
    // replyQueue: process.env.RABBIT_MQ_REPLY_QUEUE,
  },
  exchanges: [
    { name: process.env.RABBIT_MQ_USERS_EXCHANGE, type: 'fanout', autoDelete: true } as any,
  ],
  queues: [
    { name: process.env.RABBIT_MQ_USERS_QUEUE, autoDelete: true, subscribe: true } as any,
  ],
  bindings: [
    { exchange: process.env.RABBIT_MQ_USERS_EXCHANGE, target: process.env.RABBIT_MQ_USERS_QUEUE, keys: [] },
  ]
};

setTimeout(() => {
  rabbit.configure(rabbitMqConfig)
    .then(() => {
      console.log(`${process.env.APP_NAME}:${process.pid} connected to rabbitmq...`);;
    })
    .catch((error) => {
      console.error(`${process.env.APP_NAME}:${process.pid}  - rabbitmq error:`, error);
    });
}, 3000);



// setting up REST api

const app = express();
app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.use(express.json());



/** GET */
app.get(`/stream`, RequestHandlers.registerRequestSse);
app.get(`/test`, RequestHandlers.testPublishEvent);
app.get(`/users`, RequestHandlers.getAllUsers);
app.get(`/users/id/:id`, RequestHandlers.getUserById);
app.get(`/users/username/:username`, RequestHandlers.getUserByUsername);
app.get(`/`, RequestHandlers.rootPath);


/** POST */
app.post(`/users`, RequestHandlers.createUser);



/** PUT */
app.put(`/users/:id`, RequestHandlers.updateUser);



/** DELETE */
app.delete(`/users/:id`, RequestHandlers.deleteUser);




/** Start App */

app.listen(process.env.PORT, () => {
  console.log(`${process.env.APP_NAME}:${process.pid} Server listening on port ${process.env.PORT}...`);
});
