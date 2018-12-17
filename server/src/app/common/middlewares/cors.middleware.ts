import { Injectable, MiddlewareFunction, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as cors from 'cors';

import {
  CORS_ALLOWED_HEADERS,
  CORS_ALLOWED_METHODS,
  CORS_ALLOWED_ORIGINS,
  CORS_CREDENTIALS,
  CORS_EXPOSED_HEADERS,
  CORS_MAX_AGE,
  CORS_OPTIONS_SUCCESSS_CODE,
  CORS_PREFLIGHT_CONTINUE,
} from '../../common/constants';
import { ConfigService } from '../services';

/**
 * Nest middleware for Express cors middleware
 *
 * @export
 * @class CorsMiddleware
 * @implements {NestMiddleware}
 */@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly _configService: ConfigService) {}

  public resolve(): MiddlewareFunction {
    return cors({
      origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        // Origins init
        const whitelistOrigins = this._configService.get(CORS_ALLOWED_ORIGINS);
        // If no white list origins, authorized
        if (whitelistOrigins.length === 0) return callback(null, true);
        // If request origin is in white list origin, authorized
        if (whitelistOrigins.indexOf(origin) !== -1) return callback(null, true);
        // Unauthorized origin
        return callback(new UnauthorizedException('NOT_ALLOWED_BY_CORS'));
      }, // CORS request handler
      methods: this._configService.get(CORS_ALLOWED_METHODS),
      allowedHeaders: this._configService.get(CORS_ALLOWED_HEADERS),
      exposedHeaders: this._configService.get(CORS_EXPOSED_HEADERS),
      credentials: this._configService.get(CORS_CREDENTIALS),
      maxAge: this._configService.get(CORS_MAX_AGE),
      preflightContinue: this._configService.get(CORS_PREFLIGHT_CONTINUE),
      optionsSuccessStatus: this._configService.get(CORS_OPTIONS_SUCCESSS_CODE),
    });
  }
}
