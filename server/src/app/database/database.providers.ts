import * as mongoose from 'mongoose';

import { DB_CONNECTION_TOKEN } from '../common/common.constants';
import { DB_HOST, DB_NAME } from '../config/config.constants';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      mongoose.Promise = Promise;
      return await mongoose.connect(
        `mongodb://${configService.get(DB_HOST)}/${configService.get(DB_NAME)}`,
        { useNewUrlParser: true }
      );
    },
    inject: [ConfigService],
  },
];
