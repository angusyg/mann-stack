import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

/**
 * Nest middleware for Express cookie-parser middleware
 *
 * @export
 * @class CookieParserMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  public resolve(): MiddlewareFunction {
    return cookieParser();
  }
}
