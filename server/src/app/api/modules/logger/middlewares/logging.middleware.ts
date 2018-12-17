import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as expressPino from 'express-pino-logger';
import * as uuid from 'uuid';

import { Logger } from '../services';

/**
 * Nest middleware for Express express-pino-logger middleware
 *
 * @export
 * @class LoggingMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly _logger: Logger) {}

  public resolve(): MiddlewareFunction {
    return expressPino({
      logger: this._logger.getLogger(),
      genReqId: () => uuid.v4(),
    });
  }
}
