import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { ChaptersRepository } from './chapters.repository';
import { ChaptersService } from './chapters.service';
import { BooksChaptersController } from './controllers/books-chapters.controller';
import { ChaptersController } from './controllers/chapters.controller';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ChaptersRepository])],
  controllers: [ChaptersController, BooksChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
