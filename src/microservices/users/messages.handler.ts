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
import { UsernameTakenError } from "../../utils/errors/user.errors";





export async function onTestMyEvent (event: rabbit.Message<object>) {
  console.log('received event', { body: event.body });
  const data = { message: `Finished processing request!` };
  setTimeout(() => {
    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.MY_EVENT_PROCESSED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });
    event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
  }, 5000);
}

export async function onFetchUsersAll (event: rabbit.Message<object>) {
  console.log('fetch users all:', event.body);
  const data = await getAllUsers();

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
  return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
}

export async function onFetchUserByUsername (event: rabbit.Message<object>) {
  console.log('fetch user by username:', event.body);
  const data = await getUserByUsername(event.body['username']);
  return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
}



export async function onCreateUser (event: rabbit.Message<object>) {
  try {
    console.log('create user:', event.body);
    const data = await createUser(event.body['username']);

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
  catch (error: any) {
    return event.reply({ error, message: error.message });
  }
}

export async function onUpdateUser (event: rabbit.Message<object>) {
  try {
    console.log('update user:', event.body);
    const data = await updateUser(event.body['id'], event.body['username']);

    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.USER_UPDATED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });

    return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
  }
  catch (error: any) {
    return event.reply({ error, message: error.message });
  }
}

export async function onDeleteUser (event: rabbit.Message<object>) {
  try {
    console.log('delete user:', event.body);
    const data = await deleteUser(event.body['id']);

    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.USER_DELETED,
      body: data,
      contentType: CONTENT_TYPE_APP_JSON,
    });

    return event.reply({ data }, { contentType: CONTENT_TYPE_APP_JSON } as any);
  }
  catch (error: any) {
    return event.reply({ error, message: error.message });
  }
}
