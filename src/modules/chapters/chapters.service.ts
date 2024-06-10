import type { DefaultPaginationFilter } from '@common/pagination';
import { PaginationDto } from '@common/pagination';
import { Injectable } from '@nestjs/common';

import { ChaptersRepository } from './chapters.repository';
import { ChapterDto } from './dtos/chapter.dto';
import type { CreateChapterDto } from './dtos/req/create-chapter.dto';
import type { UpdateChapterDto } from './dtos/req/update-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(private readonly chaptersRepository: ChaptersRepository) {}

  async getMany(
    bookId: string,
    filters: DefaultPaginationFilter,
  ): Promise<PaginationDto<ChapterDto>> {
    const { order, skip, take } = filters;
    const [entities, total] = await this.chaptersRepository.findAndCount({
      where: {
        bookId,
      },
      take,
      skip,
      order: { createdAt: order },
    });

    return new PaginationDto(
      entities.map((entity) => new ChapterDto(entity)),
      total,
    );
  }

  async getOne(id: string): Promise<ChapterDto> {
    const entity = await this.chaptersRepository.findOneOrException({
      where: { id },
    });

    return new ChapterDto(entity);
  }

  async create(bookId: string, payload: CreateChapterDto): Promise<ChapterDto> {
    const newChapter = this.chaptersRepository.create({
      bookId,
      ...payload,
    });

    const saved = await this.chaptersRepository.save(newChapter);

    return new ChapterDto(saved);
  }

  async update(id: string, payload: UpdateChapterDto): Promise<ChapterDto> {
    const entity = await this.chaptersRepository.findOneOrException({
      where: { id },
    });

    Object.assign(entity, payload);

    await this.chaptersRepository.save(entity);

    return new ChapterDto(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.chaptersRepository.findOneOrException({
      where: { id },
    });

    await this.chaptersRepository.softRemove(entity);
  }
}
