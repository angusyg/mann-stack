import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as csurf from 'csurf';
import * as expressPino from 'express-pino-logger';
import * as helmet from 'helmet';
import * as uuid from 'uuid';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { LogService } from './logger/logger.service';

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService, private readonly logService: LogService) {}

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
          logger: this.logService.getLogger(),
          genReqId: () => uuid.v4(),
        }), // Request logger
        cookieParser(), // Cookie parser for csurf
        helmet(), // Security headers
        csurf({ cookie: true }), // CSRF token to requests
        cors({
          origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
            // Origins init
            const whitelistOrigins = this.configService.get('CORS_ALLOWED_ORIGINS');
            // If no white list origins, authorized
            if (whitelistOrigins.length === 0) return callback(null, true);
            // If request origin is in white list origin, authorized
            if (whitelistOrigins.indexOf(origin) !== -1) return callback(null, true);
            // Unauthorized origin
            return callback(new Error('Not allowed by CORS'));
          }, // CORS request handler
          methods: this.configService.get('CORS_ALLOWED_METHODS'),
          allowedHeaders: this.configService.get('CORS_ALLOWED_HEADERS'),
          exposedHeaders: this.configService.get('CORS_EXPOSED_METHODS'),
          credentials: this.configService.get('CORS_CREDENTIALS'),
          maxAge: this.configService.get('CORS_MAX_AGE'),
          preflightContinue: this.configService.get('CORS_PREFLIGHT_CONTINUE'),
          optionsSuccessStatus: this.configService.get('CORS_OPTIONS_SUCCESSS_CODE'),
        })
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
