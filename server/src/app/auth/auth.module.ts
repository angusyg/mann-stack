import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CsurfMiddleware } from '../common/middlewares';
import { AUTH_JWT_SECRET } from '../config/config.constants';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieStrategy } from './passport/cookie.strategy';
import { LocalStrategy } from './passport/local.strategy';

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
