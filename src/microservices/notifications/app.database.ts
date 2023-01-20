import {
  Sequelize,
  InitOptions,
  STRING,
  INTEGER,
  UUIDV1,
  BOOLEAN,
  JSON as JSON_TYPE,
  Model,
  BuildOptions,
  SyncOptions,
} from 'sequelize';

console.log(`process.env.DATABASE_URL:`, process.env.DATABASE_URL);



/**
  @see: https://sequelize.org/master/manual/typescript
*/
/** Model Class Type */
export interface IMyModel extends Model<any> {
  readonly id: number;
  [key: string]: any;
}
export type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IMyModel;
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  query: {
    raw: false,
  },
  // dialectOptions: {
  //   ssl: {
  //     require: false,
  //     rejectUnauthorized: false
  //   }
  // }
});

export const common_model_options: InitOptions = {
  sequelize,

  paranoid: true,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};

export const common_model_fields = {
  id:           { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:         { type: STRING, defaultValue: UUIDV1 }
};





export const User = <MyModelStatic> sequelize.define('User', {
  ...common_model_fields,

  username:                            { type: STRING, allowNull: false, unique: true },
}, common_model_options);

export const UserNotification = <MyModelStatic> sequelize.define('UserNotification', {
  ...common_model_fields,

  from_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:               { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  event:               { type: STRING, allowNull: false, defaultValue: '' },
  target_type:         { type: STRING, allowNull: false, defaultValue: '' },
  target_id:           { type: INTEGER, allowNull: false, defaultValue: 0 },
  read:                { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const UserExpoDevice = <MyModelStatic> sequelize.define('UserExpoDevice', {
  ...common_model_fields,

  user_id:              { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: JSON_TYPE, allowNull: true, defaultValue: null },
  device_id:            { type: STRING, allowNull: false, defaultValue: '' },
  device_reaction_type: { type: STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const db_init = async () => {
  const sequelize_db_sync_options: SyncOptions = {
    force: false,
    alter: false,
  };

  return sequelize.sync(sequelize_db_sync_options)
    .then(() => {
      console.log('\n\nDatabase Initialized!\n\n');
    })
    .catch((error) => {
      console.log('\n\nDatabase Failed!\n\n', error);
      throw error;
    });
};
