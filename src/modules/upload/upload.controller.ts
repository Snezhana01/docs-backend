import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators/http.decorators';
import { UploadExceptionFilter } from '../../filters/upload-exception.filter';
import { ParseFile } from '../../pipes/parse-file.pipe';
import { allowedFiles } from './constants/allowed-files';
import { ApiFiles } from './decorators/swagger.schema';
import { UploadDto } from './dtos/upload.dto';
import { AllowedFiles } from './types/allowed-files.type';
import { UploadService } from './upload.service';

@ApiTags('Загрузка файлов')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('files')
  @Auth([RoleType.REDACTOR], 'Загрузка файлов')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Загруженные файлы',
    type: [UploadDto],
  })
  @ApiNotFoundResponse({
    description: 'upload.someFilesNotFound',
  })
  @ApiFiles(allowedFiles)
  @UseFilters(new UploadExceptionFilter())
  uploadFiles(
    @UploadedFiles(ParseFile)
    files: AllowedFiles,
  ): Promise<UploadDto[]> {
    return this.uploadService.createUploads(files);
  }
}
