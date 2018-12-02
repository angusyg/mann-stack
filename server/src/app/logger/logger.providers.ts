import { ConfigService } from '../config/config.service';

import { Logger } from './logger.service';

export const loggerProviders = [
  {
    provide: Logger,
    useFactory: (configService: ConfigService) => new Logger(configService),
    inject: [ConfigService],
  },
];
