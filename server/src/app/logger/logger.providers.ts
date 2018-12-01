import { ConfigService } from '../config/config.service';

import { LogService } from './logger.service';

export const loggerProviders = [
  {
    provide: LogService,
    useFactory: (configService: ConfigService) => new LogService(configService),
    inject: [ConfigService],
  },
];
