import { Connection } from 'mongoose';

import { DB_CONNECTION_TOKEN, USER_MODEL_TOKEN } from '../../../constants';
import { UserSchema } from '../schemas';

// Defines provider for User mongoose model
export const usersProviders = [
  {
    provide: USER_MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: [DB_CONNECTION_TOKEN],
  },
];
