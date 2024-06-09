import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

import { IPageMetaParams } from '../../interfaces';

export class PageMetaDto {
  @ApiProperty()
  @IsDefined()
  readonly page: number;

  @ApiProperty()
  @IsDefined()
  readonly take: number;

  @ApiProperty()
  @IsDefined()
  readonly itemCount: number;

  @ApiProperty()
  @IsDefined()
  readonly pageCount: number;

  @ApiProperty()
  @IsDefined()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  @IsDefined()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaParams) {
    this.page = pageOptionsDto.page ?? 1;
    this.take = pageOptionsDto.take ?? 1;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
