import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as expressPino from 'express-pino-logger';
import * as helmet from 'helmet';
import * as uuid from 'uuid';

import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { LoggerModule } from './logger/logger.module';
import { Logger } from './logger/logger.service';
import { UsersModule } from './users/users.module';

import {
  CORS_ALLOWED_HEADERS,
  CORS_ALLOWED_METHODS,
  CORS_ALLOWED_ORIGINS,
  CORS_CREDENTIALS,
  CORS_EXPOSED_HEADERS,
  CORS_MAX_AGE,
  CORS_OPTIONS_SUCCESSS_CODE,
  CORS_PREFLIGHT_CONTINUE,
} from './config/config.constants';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, LoggerModule, UsersModule, AuthModule],
})
export class AppModule implements NestModule {
  constructor(private readonly _configService: ConfigService, private readonly _logger: Logger) {}

  /**
   * Adds application midlewares for security and logging
   *
   * @param {MiddlewareConsumer} consumer
   * @memberof AppModule
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        expressPino({
          logger: this._logger.getLogger(),
          genReqId: () => uuid.v4(),
        }), // Request logger
        cookieParser(), // Cookie parser for csurf
        helmet(), // Security headers
        cors({
          origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
            // Origins init
            const whitelistOrigins = this._configService.get(CORS_ALLOWED_ORIGINS);
            // If no white list origins, authorized
            if (whitelistOrigins.length === 0) return callback(null, true);
            // If request origin is in white list origin, authorized
            if (whitelistOrigins.indexOf(origin) !== -1) return callback(null, true);
            // Unauthorized origin
            return callback(new Error('Not allowed by CORS'));
          }, // CORS request handler
          methods: this._configService.get(CORS_ALLOWED_METHODS),
          allowedHeaders: this._configService.get(CORS_ALLOWED_HEADERS),
          exposedHeaders: this._configService.get(CORS_EXPOSED_HEADERS),
          credentials: this._configService.get(CORS_CREDENTIALS),
          maxAge: this._configService.get(CORS_MAX_AGE),
          preflightContinue: this._configService.get(CORS_PREFLIGHT_CONTINUE),
          optionsSuccessStatus: this._configService.get(CORS_OPTIONS_SUCCESSS_CODE),
        })
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
