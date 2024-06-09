import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { flatten, isEmpty } from 'lodash';
import type {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { In, Not } from 'typeorm';

import { FileValidationErrors } from '../../common/types/file-validation-errors.enum';
import { allowedFiles } from './constants/allowed-files';
import { UploadTypes } from './constants/upload-types.enum';
import { UploadDto } from './dtos/upload.dto';
import type { IAllowedProperties } from './interfaces/allowed-properties.interface';
import { S3Service } from './storage/s3.service';
import type { AllowedFiles } from './types/allowed-files.type';
import type { UploadEntity } from './upload.entity';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(
    private uploadRepository: UploadRepository,
    private readonly s3Service: S3Service,
  ) {}

  async createUploads(files: AllowedFiles): Promise<UploadDto[]> {
    const normalizedFiles = this.normalize(files);
    const updatedFiles = await this.s3Service.sendFiles(normalizedFiles);

    await Promise.all(
      updatedFiles.map(async (file) => {
        const upload = this.uploadRepository.create({
          fileName: file.key,
          mimeType: file.mimetype,
          type: UploadTypes[file.fieldname],
          originalFileName: file.originalname,
        });
        await upload.save();
      }),
    );

    return this.getInfoAboutLoadedFiles(updatedFiles);
  }

  async getInfoAboutLoadedFiles(
    normalizedFiles: Express.MulterS3.File[],
  ): Promise<UploadDto[]> {
    const fileNames = normalizedFiles.map((file) => file.key);

    const [foundFiles, filesCount] = await this.uploadRepository.findAndCount({
      where: { fileName: In(fileNames) },
      order: { order: 'ASC' },
    });

    if (filesCount !== normalizedFiles.length) {
      throw new NotFoundException('upload.someFilesNotFound');
    }

    const res = foundFiles.map((file) => {
      const url: string = this.s3Service.getUrl(file.fileName);

      return new UploadDto(file, url);
    });

    return res;
  }

  private normalize(uploads: AllowedFiles): Express.MulterS3.File[] {
    return flatten(Object.values(uploads));
  }

  async joinFilesWithEntity(
    property: IAllowedProperties,
    fileIds: string[],
    fileType: UploadTypes,
  ): Promise<void> {
    await this.validateFiles(fileIds, fileType);
    const flattenFiles = flatten([fileIds]);
    const filesToDelete = await this.uploadRepository.find({
      where: {
        ...property,
        type: fileType,
        id: Not(In(flattenFiles)),
      },
    });

    await this.removeFiles(filesToDelete);

    const promises: Array<Promise<UpdateResult>> = [];

    for (const [i, fileId] of flattenFiles.entries()) {
      const updatePromise = this.uploadRepository.update(
        { id: fileId },
        { ...property, order: i + 1 },
      );

      promises.push(updatePromise);
    }

    await Promise.all(promises);
  }

  private async validateFiles(
    fileIds: string[],
    fileType: UploadTypes,
  ): Promise<void> {
    const newFiles = await this.uploadRepository.findNewFiles(fileIds);

    const apiFile = allowedFiles.find((IApiFile) => IApiFile.name === fileType);

    if (!apiFile) {
      await this.removeFiles(newFiles);

      throw new NotFoundException('upload.apiFileNotFound');
    }

    const [files, filesCount] = await this.uploadRepository.findAndCount({
      where: {
        id: In(fileIds),
      },
    });

    if (filesCount !== fileIds.length) {
      await this.removeFiles(newFiles);

      throw new BadRequestException(FileValidationErrors.FILES_REQUIRED);
    }

    const { name: type, maxCount } = apiFile;

    const incorrectTypeFiles = files.find((file) => file.type !== type);

    if (!isEmpty(incorrectTypeFiles)) {
      await this.removeFiles(newFiles);

      throw new BadRequestException(FileValidationErrors.UNSUPPORTED_FILE_TYPE);
    }

    if (fileIds.length > maxCount) {
      await this.removeFiles(newFiles);

      throw new BadRequestException(FileValidationErrors.TOO_MANY_FILES);
    }
  }

  private async removeFiles(files: UploadEntity[]) {
    if (!isEmpty(files)) {
      await this.uploadRepository.remove(files);
    }
  }

  async removeUnusedFiles(): Promise<void> {
    const filesToRemove = await this.uploadRepository.getFilesToRemove();

    await this.removeFiles(filesToRemove);
  }
}
