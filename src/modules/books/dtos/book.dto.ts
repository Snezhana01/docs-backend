import { DefaultDto } from '@common/default/default.dto';
import { ApiProperty } from '@nestjs/swagger';

import { BookEntity } from '../book.entity';

export class BookDto extends DefaultDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly genre: string;

  @ApiProperty()
  readonly annotations: string;

  @ApiProperty()
  readonly authorPreferences: string;

  constructor(entity: BookEntity) {
    super(entity);

    this.name = entity.name;
    this.genre = entity.genre;
    this.annotations = entity.annotations;
    this.authorPreferences = entity.authorPreferences;
  }
}
