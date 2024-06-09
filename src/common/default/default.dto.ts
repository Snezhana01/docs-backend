import { ApiProperty } from '@nestjs/swagger';

import { DefaultEntity } from './default.entity';

export class DefaultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    entity: DefaultEntity,
    options?: { excludeId?: boolean; excludeFields?: boolean },
  ) {
    if (!options?.excludeId) {
      this.id = entity.id;
    }

    if (!options?.excludeFields) {
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }
  }
}
