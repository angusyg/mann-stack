import { HTTP_SERVER_REF, NestFactory } from '@nestjs/core';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { PORT, STATIC_PREFIX, STATIC_SERVE } from './app/common/constants';
import { AllExceptionFilter } from './app/common/filters';
import { ConfigService } from './app/config/services';
import { Logger } from './app/logger/services';


/**
 * Bootstraps application
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Logger configuration
  app.useLogger(app.get<Logger>(Logger));
  // Exception handling
  app.useGlobalFilters(new AllExceptionFilter(app.get(HTTP_SERVER_REF)));
  const configService = app.get<ConfigService>(ConfigService);
  if (configService.get(STATIC_SERVE) === true) {
    // Serve static content
    app.useStaticAssets(join(__dirname, '../../client/src'), { prefix: configService.get(STATIC_PREFIX) });
  }
  // Starts server
  await app.listen(configService.get(PORT));
}

bootstrap();
