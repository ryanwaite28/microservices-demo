import { CONTENT_TYPE_APP_JSON } from "../../utils/constants/common.string.constants";
import rabbit from 'foo-foo-mq';
import {
  getAllUsers,
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "./app.service";
import { UsersMsEventsConstants } from "../../utils/constants/users-ms.events.constants";




export async function onFetchUsersAll (event: rabbit.Message<object>) {
  console.log('fetch users all:', event.body);
  const data = await getAllUsers();
  event.ack();

  console.log(`publishing:`, process.env.RABBIT_MQ_USERS_EXCHANGE, {
    type: UsersMsEventsConstants.USERS_FETCHED,
    body: {},
    contentType: CONTENT_TYPE_APP_JSON,
  });
  rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
    type: UsersMsEventsConstants.USERS_FETCHED,
    body: {},
    contentType: CONTENT_TYPE_APP_JSON,
  });

  return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
}

export async function onFetchUserById (event: rabbit.Message<object>) {
  console.log('fetch user by id:', event.body);
  const data = await getUserById(event.body['id']);
  event.ack();
  return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
}

export async function onFetchUserByUsername (event: rabbit.Message<object>) {
  console.log('fetch user by username:', event.body);
  const data = await getUserByUsername(event.body['username']);
  event.ack();
  return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
}



export async function onCreateUser (event: rabbit.Message<object>) {
  try {
    console.log('create user:', event.body);
    const data = await createUser(event.body['username']);
    event.ack();

    console.log(`publishing:`, process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.USER_CREATED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });
    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.USER_CREATED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });

    return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
  }
  catch (error) {
    event.ack();
    return event.reply({ error });
  }
}

export async function onUpdateUser (event: rabbit.Message<object>) {
  try {
    console.log('create user:', event.body);
    const data = await updateUser(event.body['id'], event.body['username']);

    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.USER_UPDATED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });

    event.ack();
    return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
  }
  catch (error) {
    event.ack();
    return event.reply({ error });
  }
}

export async function onDeleteUser (event: rabbit.Message<object>) {
  try {
    console.log('create user:', event.body);
    const data = await deleteUser(event.body['id']);
    event.ack();

    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.USER_DELETED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });

    return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
  }
  catch (error) {
    event.ack();
    return event.reply({ error });
  }
}
