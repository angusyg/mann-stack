import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MongoExceptionFilter } from './app/common/filters';
import { PORT } from './app/config/config.constants';
import { ConfigService } from './app/config/config.service';
import { Logger } from './app/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Logger configuration
  app.useLogger(app.get<Logger>(Logger));
  app.useGlobalFilters(new MongoExceptionFilter());
  await app.listen(app.get<ConfigService>(ConfigService).get(PORT));
}
bootstrap();
