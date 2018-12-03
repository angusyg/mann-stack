import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from '../config/config.constants';
import { ConfigService } from '../config/config.service';

import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({ secretOrPrivateKey: configService.get(JWT_SECRET) }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
