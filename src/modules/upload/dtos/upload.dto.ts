import { ApiProperty } from '@nestjs/swagger';

import { DefaultDto } from '../../../common/default/default.dto';
import { UploadTypes } from '../constants/upload-types.enum';
import { UploadEntity } from '../upload.entity';

export class UploadDto extends DefaultDto {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty({ enum: UploadTypes, enumName: 'UploadTypes' })
  type: UploadTypes;

  @ApiProperty()
  url: string;

  @ApiProperty()
  order: number;

  constructor(file: UploadEntity, url?: string) {
    super(file);
    this.fileName = file.fileName;
    this.mimeType = file.mimeType;
    this.type = file.type;

    this.order = file.order;

    if (url) {
      this.url = url;
    }
  }
}
