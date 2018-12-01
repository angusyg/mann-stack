import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from './app/config/config.service';
import { LogService } from './app/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Logger configuration
  app.useLogger(app.get<LogService>(LogService));
  await app.listen(app.get<ConfigService>(ConfigService).get('PORT'));
}
bootstrap();
