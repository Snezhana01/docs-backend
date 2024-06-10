import { DefaultService } from '@common/default/default.service';
import type { DefaultPaginationFilter } from '@common/pagination';
import { PaginationDto } from '@common/pagination';
import type { UserEntity } from '@modules/users/user.entity';
import { Injectable } from '@nestjs/common';

import type { BookEntity } from './book.entity';
import { BooksRepository } from './books.repository';
import { BookDto } from './dtos/book.dto';
import type { CreateBookDto } from './dtos/req/create-book.dto';
import type { UpdateBookDto } from './dtos/req/update-book.dto';

@Injectable()
export class BooksService extends DefaultService<BookEntity> {
  constructor(private readonly booksRepository: BooksRepository) {
    super(booksRepository);
  }

  async create(user: UserEntity, payload: CreateBookDto): Promise<BookDto> {
    const newBook = this.booksRepository.create({
      userId: user.id,
      ...payload,
    });

    const saved = await this.booksRepository.save(newBook);

    return new BookDto(saved);
  }

  async getMany(
    userId: string,
    filters: DefaultPaginationFilter,
  ): Promise<PaginationDto<BookDto>> {
    const { order, skip, take } = filters;
    const [books, total] = await this.booksRepository.findAndCount({
      where: {
        userId,
      },
      take,
      skip,
      order: { createdAt: order },
    });

    return new PaginationDto(books, total);
  }

  async getOne(id: string): Promise<BookDto> {
    const book = await this.booksRepository.findOneOrException({
      where: { id },
      relations: {
        cover: true,
      },
    });

    return new BookDto(book);
  }

  async update(id: string, payload: UpdateBookDto): Promise<BookDto> {
    const book = await this.booksRepository.findOneOrException({
      where: { id },
    });

    Object.assign(book, payload);

    await this.booksRepository.save(book);

    return new BookDto(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.booksRepository.findOneOrException({
      where: { id },
    });

    await this.booksRepository.softRemove(book);
  }
}
