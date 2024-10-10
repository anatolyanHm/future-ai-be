import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || message;
    }

    const errorDetails = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      status,
    };

    console.log(`Error occurred: ${JSON.stringify(errorDetails)}`);

    response.status(status).json({
      ...errorDetails,
      error:
        exception instanceof HttpException ? exception.getResponse() : null,
    });
  }
}
