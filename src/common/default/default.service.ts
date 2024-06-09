import { Injectable, Logger } from '@nestjs/common';
import type { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import type { DefaultEntity } from './default.entity';
import { DefaultRepository } from './default.repository';

@Injectable()
export abstract class DefaultService<TEntity extends DefaultEntity> {
  constructor(private readonly repository: DefaultRepository<TEntity>) {}

  private moduleName: string = this.constructor.name
    .replace(/Service/g, '')
    .toLowerCase();

  protected defaultRelation?: FindOptionsRelations<TEntity>;

  protected defaultSelect?: FindOptionsSelect<TEntity>;

  readonly logger = new Logger(this.constructor.name);
}
