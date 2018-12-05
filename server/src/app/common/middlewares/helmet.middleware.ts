import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as helmet from 'helmet';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  public resolve(): MiddlewareFunction {
    return helmet();
  }
}
