import * as mongoose from 'mongoose';

import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  {
    provide: 'DbConnection',
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> =>
      await mongoose.connect(
        `mongodb://${configService.get('DB_HOST')}/${configService.get('DB_NAME')}`,
        { useNewUrlParser: true }
      ),
    inject: [ConfigService],
  },
];
