import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  public catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // Parse error to extract infos
    let result;
    switch (exception.code) {
      case 11000:
        result = {
          statusCode: 409,
          error: 'Duplicate key error',
          message: exception.message,
        };
        break;
      default:
        result = {
          statusCode: 500,
          error: 'Mongo error',
        };
    }
    // Returns
    response.status(result.statusCode).json(result);
  }
}
