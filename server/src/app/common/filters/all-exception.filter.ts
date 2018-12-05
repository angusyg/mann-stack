import { ArgumentsHost, Catch, HttpServer, Inject } from '@nestjs/common';
import { BaseExceptionFilter, HTTP_SERVER_REF } from '@nestjs/core';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  constructor(@Inject(HTTP_SERVER_REF) applicationRef: HttpServer) {
    super(applicationRef);
  }

  public catch(exception: any, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
