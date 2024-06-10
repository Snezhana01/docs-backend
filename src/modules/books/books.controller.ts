import { DefaultPaginationFilter, PaginationDto } from '@common/pagination';
import { UserEntity } from '@modules/users/user.entity';
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Auth, UUIDParam } from 'src/decorators/http.decorators';

import { BooksService } from './books.service';
import { BookDto } from './dtos/book.dto';
import { CreateBookDto } from './dtos/req/create-book.dto';
import { UpdateBookDto } from './dtos/req/update-book.dto';

@ApiTags('Книги')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('me')
  @ApiOkResponse({ type: PaginationDto })
  @Auth([RoleType.REDACTOR], 'Получить мои книги')
  getMe(
    @AuthUser() user: UserEntity,
    @Query() filters: DefaultPaginationFilter,
  ): Promise<PaginationDto<BookDto>> {
    return this.booksService.getMany(user.id, filters);
  }

  @Get(':id')
  @ApiOkResponse({ type: BookDto })
  @Auth([RoleType.REDACTOR], 'Получить  книгу')
  getOne(@UUIDParam('id') id: string): Promise<BookDto> {
    return this.booksService.getOne(id);
  }

  @Post()
  @ApiOkResponse({ type: BookDto })
  @Auth([RoleType.REDACTOR], 'Создать книгу')
  create(
    @AuthUser() user: UserEntity,
    @Body() payload: CreateBookDto,
  ): Promise<BookDto> {
    return this.booksService.create(user, payload);
  }

  @Patch(':id')
  @ApiOkResponse({ type: BookDto })
  @Auth([RoleType.REDACTOR], 'Обновить книгу')
  update(
    @UUIDParam('id') id: string,
    @Body() payload: UpdateBookDto,
  ): Promise<BookDto> {
    return this.booksService.update(id, payload);
  }
}
