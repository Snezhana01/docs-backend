import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class UploadExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      return this.sendResponse(
        response,
        'upload.payloadTooLarge',
        'Payload Too Large',
      );
    }

    if (message === 'Unexpected field') {
      return this.sendResponse(
        response,
        'upload.tooManyFiles',
        'Too Many Files',
      );
    }

    if (status === HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
      return this.sendResponse(
        response,
        'upload.unsupportedFileType',
        'Unsupported File Type',
      );
    }

    this.sendResponse(response, message, 'Bad Request');
  }

  private sendResponse(response: Response, message: string, error: string) {
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error,
    });
  }
}
