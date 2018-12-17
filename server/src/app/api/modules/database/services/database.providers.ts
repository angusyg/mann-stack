import * as mongoose from 'mongoose';

import { DB_HOST, DB_NAME } from '../../../../common/constants';
import { ConfigService } from '../../../../common/services';

import { DB_CONNECTION_TOKEN } from '../../../constants';

// Defines provider for database connection
export const databaseProviders = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      (mongoose as any).Promise = Promise;
      return await mongoose.connect(
        `mongodb://${configService.get(DB_HOST)}/${configService.get(DB_NAME)}`,
        { useNewUrlParser: true }
      );
    },
    inject: [ConfigService],
  },
];
