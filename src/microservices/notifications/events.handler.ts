import { CONTENT_TYPE_APP_JSON } from "../../utils/constants/common.string.constants";
import rabbit from 'foo-foo-mq';
import {
  createUser,
  updateUser,
  deleteUser
} from "./app.service";




export async function onUsersFetched (event: rabbit.Message<object>) {
  console.log('fetched users all:', event.body);
  event.ack();
}

export async function onCreateUser (event: rabbit.Message<object>) {
  try {
    console.log('user created:', event.body);
    const data = await createUser(event.body['username']);
    event.ack();
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
    event.ack();
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
  }
  catch (error) {
    event.ack();
    return event.reply({ error });
  }
}
