import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CookieParserMiddleware, CorsMiddleware, HelmetMiddleware, LoggingMiddleware } from './common/middlewares';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';

/**
 * Application module
 *
 * @export
 * @class AppModule
 * @implements {NestModule}
 */
@Module({
  imports: [ConfigModule, LoggerModule, UsersModule, AuthModule, CommonModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  /**
   * Adds application midlewares for security and logging
   *
   * @param {MiddlewareConsumer} consumer
   * @memberof AppModule
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware, HelmetMiddleware, CorsMiddleware, CookieParserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
