import { Connection } from 'mongoose';

import { DB_CONNECTION_TOKEN } from '../common/constants';

import { UserSchema } from './schemas/user.schema';
import { USER_MODEL_TOKEN } from './users.constants';

export const usersProviders = [
  {
    provide: USER_MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: [DB_CONNECTION_TOKEN],
  },
];
