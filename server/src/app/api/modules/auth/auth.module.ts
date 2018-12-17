import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AUTH_JWT_SECRET } from '../../../common/constants';
import { ConfigService } from '../../../common/services';
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
      useFactory: async (configService: ConfigService) => ({ secretOrPrivateKey: configService.get(AUTH_JWT_SECRET) }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, CookieStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
