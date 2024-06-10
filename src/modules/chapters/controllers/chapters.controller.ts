import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Auth, UUIDParam } from 'src/decorators/http.decorators';

import { ChaptersService } from '../chapters.service';
import { ChapterDto } from '../dtos/chapter.dto';
import { UpdateChapterDto } from '../dtos/req/update-chapter.dto';

@ApiTags('Главы')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get(':id')
  @ApiOkResponse({ type: ChapterDto })
  @Auth([RoleType.REDACTOR], 'Получить главу')
  getChapters(@UUIDParam('id') id: string): Promise<ChapterDto> {
    return this.chaptersService.getOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ChapterDto })
  @Auth([RoleType.REDACTOR], 'Обновить главу')
  update(
    @UUIDParam('id') id: string,
    @Body() payload: UpdateChapterDto,
  ): Promise<ChapterDto> {
    return this.chaptersService.update(id, payload);
  }

  @Delete(':id')
  @ApiOkResponse({})
  @Auth([RoleType.REDACTOR], 'Удалить главу')
  remove(@UUIDParam('id') id: string): Promise<void> {
    return this.chaptersService.remove(id);
  }
}
