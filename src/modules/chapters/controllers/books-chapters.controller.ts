import { DefaultPaginationFilter, PaginationDto } from '@common/pagination';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Auth, UUIDParam } from 'src/decorators/http.decorators';

import { ChaptersService } from '../chapters.service';
import { ChapterDto } from '../dtos/chapter.dto';
import { CreateChapterDto } from '../dtos/req/create-chapter.dto';

@ApiTags('Главы книги')
@Controller('books')
export class BooksChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get(':bookId/chapters')
  @ApiOkResponse({ type: PaginationDto })
  @Auth([RoleType.REDACTOR], 'Получить главы книги')
  getChapters(
    @UUIDParam('bookId') bookId: string,
    @Query() filters: DefaultPaginationFilter,
  ): Promise<PaginationDto<ChapterDto>> {
    return this.chaptersService.getMany(bookId, filters);
  }

  @Post(':bookId/chapters')
  @ApiOkResponse({ type: ChapterDto })
  @Auth([RoleType.REDACTOR], 'Получить главы книги')
  create(
    @UUIDParam('bookId') bookId: string,
    @Body() payload: CreateChapterDto,
  ): Promise<ChapterDto> {
    return this.chaptersService.create(bookId, payload);
  }
}
