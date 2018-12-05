import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as csurf from 'csurf';

@Injectable()
export class CsurfMiddleware implements NestMiddleware {
  public resolve(): MiddlewareFunction {
    return csurf({ cookie: { key: 'XSRF-TOKEN' }, ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] });
  }
}
