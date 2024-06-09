import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import {
  Injectable,
  mixin,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileFieldsInterceptor as NestFileFieldsInterceptor } from '@nestjs/platform-express';
import path from 'path';

import { FileValidationErrors } from '../../../common/types/file-validation-errors.enum';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { uploadFormats } from '../constants/upload-formats';
import type { IApiFile } from '../interfaces/IApiFiles';

export interface IFileInfo {
  file: Express.MulterS3.File;
  fileName: string;
}

export function checkFilesInterceptor(
  apiFiles: IApiFile[],
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(private readonly configService: ApiConfigService) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
      const fileIntConst = NestFileFieldsInterceptor(apiFiles, {
        limits: {
          fileSize: this.configService.uploadConfig.maxFileSize,
        },
        fileFilter: (_request, file, callback) => {
          const extension = path.extname(file.originalname);

          const allowedFilesString = uploadFormats[file.fieldname];

          const allowedFiles = allowedFilesString
            .split(',')
            .map((index) => index.trim());

          if (!allowedFiles.includes(extension.toLowerCase())) {
            callback(
              new UnsupportedMediaTypeException(
                FileValidationErrors.UNSUPPORTED_FILE_TYPE,
              ),
              false,
            );

            return;
          }

          callback(null, true);
        },
      });
      const fileInt = new fileIntConst();

      return fileInt.intercept(context, next);
    }
  }

  return mixin(Interceptor);
}
