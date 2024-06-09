import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, ForbiddenException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

@Catch(ForbiddenException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return this.sendResponse(response, 'auth.forbidden', 'Forbidden');
  }

  private sendResponse(response: Response, message: string, error?: string) {
    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message,
      error,
    });
  }
}
