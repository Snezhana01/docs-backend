import { ConflictException, NotFoundException } from '@nestjs/common';
import type {
  FindManyOptions,
  FindOneOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { Repository } from 'typeorm';

import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { PageDto } from '../page/page.dto';
import { PageMetaDto } from '../page/page-meta.dto';
import type { PageOptionsDto } from '../page/page-options.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import { DefaultEntity } from './default.entity';

@CustomRepository(DefaultEntity)
export class DefaultRepository<
  TEntity extends DefaultEntity,
> extends Repository<TEntity> {
  private moduleName: string = this.constructor.name
    .replace(/Repository/g, '')
    .toLowerCase();

  private notFoundMessage = `${this.moduleName}.notFound`;

  private existMessage = `${this.moduleName}.exits`;

  async findOneOrException(options: FindOneOptions<TEntity>): Promise<TEntity> {
    const entity = await this.findOne(options);

    if (!entity) {
      throw new NotFoundException(this.notFoundMessage);
    }

    return entity;
  }

  async getAllPage(
    queryBuilder: SelectQueryBuilder<TEntity>,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TEntity>> {
    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: {
        ...pageOptionsDto,
        skip: pageOptionsDto.skip,
      },
    });

    return new PageDto(entities, pageMetaDto);
  }

  async getAllTotal(
    queryBuilder: SelectQueryBuilder<TEntity>,
    take?: number,
    skip?: number,
  ): Promise<PaginationDto<TEntity>> {
    if (typeof skip === 'number') {
      queryBuilder.skip(skip);
    }

    if (typeof take === 'number') {
      queryBuilder.take(take);
    }

    const promiseTotal = queryBuilder.getCount();

    if (typeof take !== 'number' || take > 0) {
      const promiseRes = queryBuilder.getMany();

      const [total, res] = await Promise.all([promiseTotal, promiseRes]);

      return new PaginationDto(res, total);
    }

    const [total] = await Promise.all([promiseTotal]);

    return new PaginationDto([], total);
  }

  async getAllRawTotal(
    queryBuilder: SelectQueryBuilder<TEntity>,
    take?: number,
    skip?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ entities: TEntity[]; raw: any[]; total: number }> {
    if (typeof skip === 'number') {
      queryBuilder.skip(skip);
    }

    if (typeof take === 'number') {
      queryBuilder.take(take);
    }

    const total = await queryBuilder.getCount();

    if (typeof take !== 'number' || take > 0) {
      const { entities, raw } = await queryBuilder.getRawAndEntities();

      return { entities, raw, total };
    }

    return { entities: [], raw: [], total };
  }

  async existOrException(options: FindManyOptions<TEntity>): Promise<void> {
    const isExist = await this.exist(options);

    if (isExist) {
      throw new ConflictException(this.existMessage);
    }
  }
}
