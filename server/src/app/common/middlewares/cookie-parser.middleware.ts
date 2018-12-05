import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  public resolve(): MiddlewareFunction {
    return cookieParser();
  }
}
