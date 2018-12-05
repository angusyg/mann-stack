import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';

import { CookieParserMiddleware, CorsMiddleware, HelmetMiddleware, LoggingMiddleware } from './common/middlewares';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, LoggerModule, UsersModule, AuthModule],
})
export class AppModule implements NestModule {
  /**
   * Adds application midlewares for security and logging
   *
   * @param {MiddlewareConsumer} consumer
   * @memberof AppModule
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggingMiddleware, HelmetMiddleware, CookieParserMiddleware, CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
