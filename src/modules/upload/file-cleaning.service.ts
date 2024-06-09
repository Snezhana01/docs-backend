import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UploadService } from './upload.service';

@Injectable()
export class FileCleaningService {
  constructor(private uploadService: UploadService) {}

  @Cron('0 0 3 * * *', {
    timeZone: 'Europe/Moscow',
  })
  async handleCron() {
    await this.uploadService.removeUnusedFiles();
  }
}
