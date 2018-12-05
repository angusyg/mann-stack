import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from '../config/config.constants';
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
      useFactory: async (configService: ConfigService) => ({ secretOrPrivateKey: configService.get(JWT_SECRET) }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, CookieStrategy, LocalStrategy, CsrfStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
