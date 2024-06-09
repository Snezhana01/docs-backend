import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty({ isArray: true })
  data: T[];

  constructor(data: T[], total: number) {
    this.data = data;
    this.total = total;
  }
}
