import { DefaultDto } from '@common/default/default.dto';
import { UploadDto } from '@modules/upload/dtos/upload.dto';
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

  @ApiProperty({ type: () => UploadDto })
  readonly cover: UploadDto;

  constructor(entity: BookEntity) {
    super(entity);

    this.name = entity.name;
    this.genre = entity.genre;
    this.annotations = entity.annotations;
    this.authorPreferences = entity.authorPreferences;
    this.cover = entity.cover && new UploadDto(entity.cover);
  }
}
