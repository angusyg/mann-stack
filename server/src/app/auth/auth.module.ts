import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AUTH_JWT_SECRET } from '../common/constants';
import { CsurfMiddleware } from '../common/middlewares';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services';
import { UsersModule } from '../users/users.module';

import { AuthController } from './controllers';
import { CookieStrategy, LocalStrategy } from './passport';
import { AuthService } from './services';

/**
 * Module for user signup and authentication
 *
 * @export
 * @class AuthModule
 */
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ secretOrPrivateKey: configService.get(AUTH_JWT_SECRET) }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, CookieStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {
  /**
   * Adds application midlewares for security and logging
   *
   * @param {MiddlewareConsumer} consumer
   * @memberof AuthModule
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CsurfMiddleware)
      .exclude({ path: 'api/auth/signup', method: RequestMethod.POST }, { path: 'api/auth/login', method: RequestMethod.POST })
      .forRoutes(AuthController);
  }
}
