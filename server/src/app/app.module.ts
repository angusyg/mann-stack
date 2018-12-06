import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { ApiModule } from './api/api.module';
import { routes } from './app.routes';
import { ClientModule } from './client/client.module';
import { CommonModule } from './common/common.module';

/**
 * Application module
 *
 * @export
 * @class AppModule
 * @implements {NestModule}
 */
@Module({
  imports: [RouterModule.forRoutes(routes), CommonModule, ClientModule, ApiModule],
})
export class AppModule {}
