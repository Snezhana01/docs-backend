/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { UploadDto } from '../modules/upload/dtos/upload.dto';
import { S3Service } from '../modules/upload/storage/s3.service';
import { UploadEntity } from '../modules/upload/upload.entity';

@Injectable()
export class GenerateUrlForUploadsInterceptor implements NestInterceptor {
  constructor(private s3Service: S3Service) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (flow) => {
        if (this.isObject(flow) || Array.isArray(flow)) {
          flow = await this.checksHasUploads(flow);
        }

        return flow;
      }),
    );
  }

  private checksHasUploads(value: any): any {
    const uploadKeys = Object.keys(value).filter(
      (key) =>
        this.isInstanceofUploadDto(value[key]) ||
        this.isInstanceofUploadEntity(value[key]),
    );
    const uploadsKeys = Object.keys(value).filter(
      (key) =>
        Array.isArray(value[key]) &&
        (this.isInstanceofUploadDto(value[key][0]) ||
          this.isInstanceofUploadEntity(value[key][0])),
    );

    if (uploadsKeys.length > 0) {
      value = this.addUrlForUploadsKeys(value, uploadsKeys);
    }

    if (uploadKeys.length > 0) {
      value = this.addUrlForUploadKeys(value, uploadKeys);
    }

    for (const key in value) {
      if (this.isObject(value[key])) {
        value[key] = this.checksHasUploads(value[key]);
      }

      if (Array.isArray(value[key])) {
        value[key] = value[key].map((element: any) => {
          if (this.isObject(element)) {
            element = this.checksHasUploads(element);
          }

          return element;
        });
      }
    }

    return value;
  }

  private isObject(value: unknown | any): boolean {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
  }

  private addUrlForUploadsKeys(value: any, uploadsKeys: string[]): any {
    for (const uploadsKey of uploadsKeys) {
      if (value[uploadsKey]) {
        value[uploadsKey] = value[uploadsKey].map((upload) => {
          if (upload.fileName) {
            const url = this.s3Service.getUrl(upload.fileName);
            upload.url = url;

            return upload;
          }
        });
      }
    }

    return value;
  }

  private addUrlForUploadKeys(value: any, uploadKeys: string[]): any {
    for (const uploadKey of uploadKeys) {
      if (value[uploadKey] && value[uploadKey].fileName) {
        value[uploadKey].url = this.s3Service.getUrl(value[uploadKey].fileName);
      }
    }

    return value;
  }

  private isInstanceofUploadEntity(object: any): boolean {
    return object instanceof UploadEntity;
  }

  private isInstanceofUploadDto(object: any): boolean {
    return object instanceof UploadDto;
  }
}
