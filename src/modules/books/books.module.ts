import { ChaptersModule } from '@modules/chapters/chapters.module';
import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';

import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BooksRepository]),
    ChaptersModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
