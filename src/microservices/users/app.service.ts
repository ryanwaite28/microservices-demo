/** CamelCase for service methods */

import {
  get_all_users,
  get_user_by_id,
  get_user_by_username,
  create_user,
  update_user,
  delete_user,
} from "./app.repo";




export function getAllUsers() {
  return get_all_users();
}

export function getUserById(id: number) {
  return get_user_by_id(id);
}

export function getUserByUsername(username: string) {
  return get_user_by_username(username);
}



export function createUser(username: string) {
  return create_user(username);
}

export function updateUser(id: number, username: string) {
  return update_user(id, username);
}

export function deleteUser(id: number) {
  return delete_user(id);
}

