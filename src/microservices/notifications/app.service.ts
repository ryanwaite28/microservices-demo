/** CamelCase for service methods */

import {
  create_user,
  update_user,
  delete_user,
} from "./app.repo";




export function createUser(username: string) {
  return create_user(username);
}

export function updateUser(id: number, username: string) {
  return update_user(id, username);
}

export function deleteUser(id: number) {
  return delete_user(id);
}

