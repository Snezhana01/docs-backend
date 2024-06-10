import { DefaultDto } from '@common/default/default.dto';
import { ApiProperty } from '@nestjs/swagger';

import { ChapterEntity } from '../chapter.entity';

export class ChapterDto extends DefaultDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly text: string;

  @ApiProperty()
  readonly bookId: string;

  constructor(entity: ChapterEntity) {
    super(entity);

    this.name = entity.name;
    this.text = entity.text;
    this.bookId = entity.bookId;
  }
}
