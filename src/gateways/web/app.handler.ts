import rabbit from 'foo-foo-mq';
import { Request, Response } from 'express';

import { SSE } from '../../utils/helpers/sse.helper';
import { CONTENT_TYPE_APP_JSON } from '../../utils/constants/common.string.constants';
import { UsersMsEventsConstants } from '../../utils/constants/users-ms.events.constants';
import { UsersMsMessagesConstants } from '../../utils/constants/users-ms.messages.constants';
import { USERNAME_REGEX } from '../../utils/constants/users.regex.constants';



const sse = new SSE();



export function rootPath (request: Request, response: Response) {
  return response.json({ message: `Web API Gateway Online` });
}

export function registerRequestSse (request: Request, response: Response) {
  // SSE
  console.log(`stream request:`,);

  const res = response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': request.headers.origin || '*',
  });

  const connectionId = sse.addConnection(`1`, request, response);

  const eventMessage: string = "event: " + `Success` + "\n" + "data: " + JSON.stringify({ connectionId, message: `admit one` }) + "\n\n";
  console.log({ eventMessage });
  return response.write(eventMessage);
}

export async function testPublishEvent (request: Request, response: Response) {
  // test event to message broker (should be picked up by users-microservice)
  const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
    type: UsersMsMessagesConstants.MY_EVENT,
    body: { message: `Admit One` },
    contentType: CONTENT_TYPE_APP_JSON,
  });

  reply.ack();

  return response.json(reply.body);
}






export async function getAllUsers (request: Request, response: Response)  {
  const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
    type: UsersMsMessagesConstants.FETCH_USERS_ALL,
    body: {  },
    contentType: CONTENT_TYPE_APP_JSON,
  });

  reply.ack()?.then(() => {
    console.log(`reply acknowledged by web api gateway`);
  });

  return response.json(reply.body);
}

export async function getUserById (request: Request, response: Response)  {
  if (!(/[\d]+/).test(request.params.id)) {
    return response.status(400).json({
      message: `id param is not a number`
    });
  }

  const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
    type: UsersMsMessagesConstants.FETCH_USER_BY_ID,
    body: { id: parseInt(request.params.id, 10) },
    contentType: CONTENT_TYPE_APP_JSON,
  });

  reply.ack()?.then(() => {
    console.log(`reply acknowledged by web api gateway`);
  });

  return response.json(reply.body);
}

export async function getUserByUsername (request: Request, response: Response)  {
  const username = request.params.username?.trim().replace(/[\s]/g, '');
  if (!username) {
    return response.status(400).json({
      message: `Username is missing`
    });
  }
  if (!USERNAME_REGEX.test(username)) {
    return response.status(400).json({
      message: `Username is invalid`
    });
  }

  const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
    type: UsersMsMessagesConstants.FETCH_USER_BY_USERNAME,
    body: { username },
    contentType: CONTENT_TYPE_APP_JSON,
  });

  reply.ack()?.then(() => {
    console.log(`reply acknowledged by web api gateway`);
  });

  return response.json(reply.body);
}

export async function createUser (request: Request, response: Response) {
  console.log(`request.body:`, request.body);
  const username = request.body.username?.trim().replace(/[\s]/g, '');
  if (!username) {
    return response.status(400).json({
      message: `Username is missing`
    });
  }
  if (!USERNAME_REGEX.test(username)) {
    return response.status(400).json({
      message: `Username is invalid`
    });
  }

  try {
    const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsMessagesConstants.CREATE_USER,
      body: { username },
      contentType: CONTENT_TYPE_APP_JSON,
    });
  
    reply.ack()?.then(() => {
      console.log(`reply acknowledged by web api gateway`);
    });
  
    const statusCode: number = (reply.body as object)['error'] ? 400 : 200;
    return response.status(statusCode).json(reply.body);
  }
  catch (error) {
    return response.status(500).json({
      error,
      message: `Could not process request; something went wrong..`
    });
  }
}

export async function updateUser (request: Request, response: Response) {
  console.log(`request.body:`, request.body);
  const username = request.body.username?.trim().replace(/[\s]/g, '');
  if (!username) {
    return response.status(400).json({
      message: `Username is missing`
    });
  }
  if (!USERNAME_REGEX.test(username)) {
    return response.status(400).json({
      message: `Username is invalid`
    });
  }

  try {
    const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsMessagesConstants.UPDATE_USER,
      body: { id: parseInt(request.params.id, 10), username },
      contentType: CONTENT_TYPE_APP_JSON,
    });
  
    reply.ack()?.then(() => {
      console.log(`reply acknowledged by web api gateway`);
    });
  
    const statusCode: number = (reply.body as object)['error'] ? 400 : 200;
    return response.status(statusCode).json(reply.body);
  }
  catch (error) {
    return response.status(500).json({
      error,
      message: `Could not process request; something went wrong..`
    });
  }
}


export async function deleteUser (request: Request, response: Response) {
  if (!(/[\d]+/).test(request.params.id)) {
    return response.status(400).json({
      message: `id param is not a number`
    });
  }

  try {
    const reply = await rabbit.request(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsMessagesConstants.DELETE_USER,
      body: { id: parseInt(request.params.id, 10) },
      contentType: CONTENT_TYPE_APP_JSON,
    });
  
    reply.ack()?.then(() => {
      console.log(`reply acknowledged by web api gateway`);
    });
  
    const statusCode: number = (reply.body as object)['error'] ? 400 : 200;
    return response.status(statusCode).json(reply.body);
  }
  catch (error) {
    return response.status(500).json({
      error,
      message: `Could not process request; something went wrong..`
    });
  }
}
