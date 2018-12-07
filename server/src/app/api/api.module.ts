import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CookieParserMiddleware, CorsMiddleware, CsurfMiddleware, HelmetMiddleware } from '../common/middlewares';

import { ApiController } from './api.controller';
import { AuthModule, DatabaseModule, LoggerModule, UsersModule } from './modules';
import { LoggingMiddleware } from './modules/logger/middlewares';

/**
 * Module to expose REST API
 *
 * @export
 * @class ApiModule
 */
@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, LoggerModule],
  controllers: [ApiController],
})
export class ApiModule {
  /**
   * Adds application midlewares for security and logging
   *
   * @param {MiddlewareConsumer} consumer
   * @memberof ApiModule
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggingMiddleware, HelmetMiddleware, CorsMiddleware, CookieParserMiddleware, CsurfMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
