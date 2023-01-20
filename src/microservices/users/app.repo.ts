/** snake_case for repo methods */
/** Having a repo layer in case we want to swap databases/ORM/etc */

import { User } from "./app.database";



export function get_all_users() {
  return User.findAll().then((models) => models.map((model) => model.dataValues));
}

export function get_user_by_id(id: number) {
  return User.findByPk(id).then((model) => {
    return model && model.dataValues || null;
  });
}

export function get_user_by_username(username: string) {
  return User.findOne({ where: { username } }).then((model) => {
    return model && model.dataValues || null;
  });
}

export function create_user(username: string) {
  return User.create({ username }).then((model) => {
    return model.dataValues;
  });
}

export async function update_user(id: number, username: string) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }

  await user.update({ username });

  return user.dataValues;
}

export async function delete_user(id: number) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }

  await user.destroy({  });

  return user?.dataValues;
}