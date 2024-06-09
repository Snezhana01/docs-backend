import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({ type: () => PageMetaDto })
  meta: PageMetaDto;

  @ApiProperty({ isArray: true })
  data: T[];

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
