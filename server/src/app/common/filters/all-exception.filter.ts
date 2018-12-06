import { ArgumentsHost, Catch, HttpServer, Inject } from '@nestjs/common';
import { BaseExceptionFilter, HTTP_SERVER_REF } from '@nestjs/core';
import { MongoError } from 'mongodb';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  constructor(@Inject(HTTP_SERVER_REF) applicationRef: HttpServer) {
    super(applicationRef);
  }

  /**
   * Handle error
   *
   * @param {*} exception error to handle
   * @param {ArgumentsHost} host request context
   * @memberof AllExceptionFilter
   */
  public catch(exception: any, host: ArgumentsHost) {
    if (!this.checkMongoError(exception, host) && !this.checkCsurfError(exception, host)) {
      super.catch(exception, host);
    }
  }

  /**
   * Handles CSURF middleware errors
   *
   * @private
   * @param {*} exception error to handle
   * @param {ArgumentsHost} host request context
   * @returns {boolean} true if error has been handled
   * @memberof AllExceptionFilter
   */
  private checkCsurfError(exception: any, host: ArgumentsHost): boolean {
    if (typeof exception === 'object' && exception.code === 'EBADCSRFTOKEN') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const statusCode = 403;
      response.status(statusCode).json({
        statusCode,
        error: 'BAD_CSRF_TOKEN',
        message: exception.message,
      });
      return true;
    }
    return false;
  }

  /**
   * Handles Mongodb errors
   *
   * @private
   * @param {*} exception error to handle
   * @param {ArgumentsHost} host request context
   * @returns {boolean} true if error has been handled
   * @memberof AllExceptionFilter
   */
  private checkMongoError(exception: any, host: ArgumentsHost): boolean {
    if (typeof exception === 'object' && exception instanceof MongoError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      // Parse error to extract infos
      let result;
      switch (exception.code) {
        case 11000:
          result = {
            statusCode: 409,
            error: 'MONGO_DUPLICATE_KEY_ERROR',
            message: exception.message,
          };
          break;
        default:
          result = {
            statusCode: 500,
            error: 'MONGO_ERROR',
            message: exception.message,
          };
      }
      // Returns
      response.status(result.statusCode).json(result);
      return true;
    }
    return false;
  }
}
