import type { PipeTransform } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(files: Express.Multer.File[]): Express.Multer.File[] {
    if (files === undefined || files === null) {
      throw new HttpException(
        'uploads.atLeastOneTypeRequired',
        HttpStatus.LENGTH_REQUIRED,
      );
    }

    if (isEmpty(Object.values(files))) {
      throw new HttpException(
        'uploads.atLeastOneFileRequired',
        HttpStatus.LENGTH_REQUIRED,
      );
    }

    return files;
  }
}
