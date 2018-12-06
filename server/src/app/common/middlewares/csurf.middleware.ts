import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as csurf from 'csurf';

/**
 * Nest middleware for Express csurf middleware
 *
 * @export
 * @class CsurfMiddleware
 * @implements {NestMiddleware}
 */@Injectable()
export class CsurfMiddleware implements NestMiddleware {
  public resolve(): MiddlewareFunction {
    return csurf({ cookie: true });
  }
}
