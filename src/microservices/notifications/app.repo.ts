/** snake_case for repo methods */
/** Having a repo layer in case we want to swap databases/ORM/etc */

import { User } from "./app.database";





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