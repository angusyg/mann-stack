import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as helmet from 'helmet';

/**
 * Nest middleware for Express helmet middleware
 *
 * @export
 * @class HelmetMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  public resolve(): MiddlewareFunction {
    return helmet();
  }
}
