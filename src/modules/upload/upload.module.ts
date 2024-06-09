import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { CodeGeneratorService } from '../../shared/services/code-generator.service';
import { FileCleaningService } from './file-cleaning.service';
import { S3Service } from './storage/s3.service';
import { UploadController } from './upload.controller';
import { UploadRepository } from './upload.repository';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UploadRepository])],
  controllers: [UploadController],
  providers: [
    UploadService,
    CodeGeneratorService,
    FileCleaningService,
    S3Service,
  ],
  exports: [UploadService, S3Service],
})
export class UploadModule {}
