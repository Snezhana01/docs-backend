/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/naming-convention */
import type { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { readFile } from 'fs';
// eslint-disable-next-line import/no-namespace
import heicConvert from 'heic-convert';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

import { ApiConfigService } from '../../../shared/services/api-config.service';
import { UploadTypes } from '../constants/upload-types.enum';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  private readonly s3: S3;

  private readonly bucketName: string;

  private extensionForCompress = ['.png', '.jpg', '.jpeg'];

  constructor(private readonly apiConfig: ApiConfigService) {
    const { S3Config } = apiConfig;
    this.s3Client = new S3Client({
      region: S3Config.region,
      credentials: {
        accessKeyId: S3Config.accessKeyId,
        secretAccessKey: S3Config.secretAccessKey,
      },
      forcePathStyle: true,
      endpoint: S3Config.endpoint,
    });
    this.s3 = new S3({
      region: S3Config.region,
      credentials: {
        accessKeyId: S3Config.accessKeyId,
        secretAccessKey: S3Config.secretAccessKey,
      },
      s3ForcePathStyle: true,
      endpoint: S3Config.endpoint,
    });

    this.bucketName = S3Config.bucketName;
  }

  compressImage(
    fileBuffer: Buffer,
    maxWidth: number,
    maxHeight: number,
  ): Promise<Buffer> {
    return sharp(fileBuffer)
      .resize({ width: maxWidth, height: maxHeight, fit: 'inside' })
      .toBuffer();
  }

  private async convertHeicToPng(heicBuffer: Buffer): Promise<Buffer> {
    try {
      const data = await heicConvert({
        buffer: heicBuffer,
        format: 'PNG',
      });

      return Buffer.from(data);
    } catch (error) {
      throw new BadRequestException(
        `Ошибка при преобразовании из HEIC в PNG ${error}`,
      );
    }
  }

  async sendFile(file: Express.MulterS3.File): Promise<Express.MulterS3.File> {
    try {
      let fileBuffer = file.buffer;
      let fileName = this.createFileName(file);
      const extension = path.extname(file.originalname);
      let params = this.getParams(file, fileName);

      if (extension === '.heic' || extension === '.heif') {
        const pngBuffer = await this.convertHeicToPng(file.buffer);

        file.mimetype = 'image/png';
        file.originalname = fileName.replace(/(heif)|(heic)/gm, 'png');
        fileName = fileName.replace(/(heif)|(heic)/gm, 'png');
        fileBuffer = pngBuffer;
        params = { ...params, Key: fileName };
      }

      if (this.extensionForCompress.includes(extension)) {
        params.Body = await this.compressImage(fileBuffer, 800, 800);
      }

      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      const res = { ...file, key: fileName };

      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendFiles(
    files: Express.MulterS3.File[],
  ): Promise<Express.MulterS3.File[]> {
    const res = await Promise.all(
      files.map(async (file) => await this.sendFile(file)),
    );

    return res;
  }

  getUrl(fileName: string): string {
    const s3Params = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: 345_600, // 4 days (in seconds) // Время жизни url доступа
    };
    const url = this.s3.getSignedUrl('getObject', s3Params);

    return url;
  }

  private toS3FileNameFormat(filename: string): string {
    filename = filename.replace(/[^\w .-]/gi, '');
    filename = filename.replace(/\s+/g, '_');

    return filename;
  }

  private createFileName(file: Express.MulterS3.File): string {
    const fileName = `${String(
      UploadTypes[file.fieldname],
    ).toLocaleLowerCase()}/${
      file.mimetype
    }/${uuidv4()}-${this.toS3FileNameFormat(file.originalname)}`;

    return fileName;
  }

  private getParams(
    file: Express.MulterS3.File,
    key: string,
  ): PutObjectCommandInput {
    return {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
    };
  }

  async uploadFileFromPublic(filePath: string): Promise<string> {
    try {
      const fileBuffer = await promisify(readFile)(`${filePath}`);
      const fileName = path.basename(filePath);
      const extension = path.extname(filePath);
      let finalBuffer = fileBuffer;
      let finalFileName = fileName;

      if (extension === '.heic' || extension === '.heif') {
        finalBuffer = await this.convertHeicToPng(fileBuffer);
        finalFileName = fileName.replace(/(heif)|(heic)/gm, 'png');
      }

      if (this.extensionForCompress.includes(extension)) {
        finalBuffer = await this.compressImage(fileBuffer, 800, 800);
      }

      const s3FileName = `${uuidv4()}-${this.toS3FileNameFormat(
        finalFileName,
      )}`;
      const params: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: s3FileName,
        Body: finalBuffer,
      };

      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      return s3FileName;
    } catch (error) {
      throw new BadRequestException(`Error uploading file: ${error.message}`);
    }
  }
}
