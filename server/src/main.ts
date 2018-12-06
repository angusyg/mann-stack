import { HTTP_SERVER_REF, NestFactory } from '@nestjs/core';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { AllExceptionFilter } from './app/common/filters';
import { PORT } from './app/config/config.constants';
import { ConfigService } from './app/config/config.service';
import { Logger } from './app/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Logger configuration
  app.useLogger(app.get<Logger>(Logger));
  app.useGlobalFilters(new AllExceptionFilter(app.get(HTTP_SERVER_REF)));
  app.useStaticAssets(join(__dirname, '../../client/src'), {prefix: '/public/'});
  await app.listen(app.get<ConfigService>(ConfigService).get(PORT));
}
bootstrap();
