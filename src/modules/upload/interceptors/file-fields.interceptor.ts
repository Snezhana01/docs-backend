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
import { diskStorage } from 'multer';
import path from 'path';

import { FileValidationErrors } from '../../../common/types/file-validation-errors.enum';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { CodeGeneratorService } from '../../../shared/services/code-generator.service';
import { uploadFormats } from '../constants/upload-formats';
import { UploadTypes } from '../constants/upload-types.enum';
import type { IApiFile } from '../interfaces/IApiFiles';
import { UploadRepository } from '../upload.repository';

export function fileFiledsInterceptor(
  apiFiles: IApiFile[],
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(
      private readonly codeGeneratorService: CodeGeneratorService,
      private readonly configService: ApiConfigService,
      private readonly uploadRepository: UploadRepository,
    ) {}

    private async insertToRepository(file: Express.Multer.File) {
      const upload = this.uploadRepository.create({
        fileName: file.filename,
        mimeType: file.mimetype,
        type: UploadTypes[file.fieldname],
        originalFileName: file.originalname,
      });
      await upload.save();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
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

          // eslint-disable-next-line unicorn/no-null
          callback(null, true);
        },
        storage: diskStorage({
          destination: this.configService.uploadConfig.uploadDirectory,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          filename: async (request, file, callback) => {
            file.originalname = Buffer.from(
              file.originalname,
              'latin1',
            ).toString('utf8');
            file.filename =
              this.codeGeneratorService.generateCode(
                this.configService.uploadConfig.fileNameLength,
                this.configService.uploadConfig.fileNameCharacters,
              ) + path.extname(file.originalname);

            await this.insertToRepository(file);

            // eslint-disable-next-line unicorn/no-null
            callback(null, file.filename);
          },
        }),
      });
      const fileInt = new fileIntConst();

      return fileInt.intercept(context, next);
    }
  }

  return mixin(Interceptor);
}
