import { DefaultRepository } from '../../common/default/default.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { BookEntity } from './book.entity';

@CustomRepository(BookEntity)
export class BooksRepository extends DefaultRepository<BookEntity> {}
