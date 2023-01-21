import * as dotenv from 'dotenv';
dotenv.config();

import rabbit from 'foo-foo-mq';
import { UsersMsEventsConstants } from '../../utils/constants/users-ms.events.constants';
import { UsersMsMessagesConstants } from '../../utils/constants/users-ms.messages.constants';
import { db_init } from './app.database';
import * as EventsHandler from './events.handler';
// import * as MessagesHandler from './messages.handler';



/** Setup Microservice via Message Broker Listener */

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
    { name: process.env.RABBIT_MQ_NOTIFICATIONS_QUEUE, autoDelete: true, subscribe: true } as any,
  ],
  bindings: [
    { exchange: process.env.RABBIT_MQ_USERS_EXCHANGE, target: process.env.RABBIT_MQ_NOTIFICATIONS_QUEUE, keys: [] },
  ]
};





db_init().then(() => {
  setTimeout(() => {
    rabbit.configure(rabbitMqConfig)
      .then(() => {
        console.log(`${process.env.APP_NAME}:${process.pid} connected to rabbitmq...`);;
      })
      .catch((error) => {
        console.error(`${process.env.APP_NAME}:${process.pid}  - rabbitmq error:`, error);
      });
  }, 3000);
});




/** Listen to Messages (typically from some gateway request) */


rabbit.handle(UsersMsEventsConstants.USERS_FETCHED, EventsHandler.onUsersFetched, process.env.RABBIT_MQ_NOTIFICATIONS_QUEUE);

rabbit.handle(UsersMsEventsConstants.USER_CREATED, EventsHandler.onCreateUser, process.env.RABBIT_MQ_NOTIFICATIONS_QUEUE);
rabbit.handle(UsersMsEventsConstants.USER_UPDATED, EventsHandler.onUpdateUser, process.env.RABBIT_MQ_NOTIFICATIONS_QUEUE);
rabbit.handle(UsersMsEventsConstants.USER_DELETED, EventsHandler.onDeleteUser, process.env.RABBIT_MQ_NOTIFICATIONS_QUEUE);



/** Listen to Events */