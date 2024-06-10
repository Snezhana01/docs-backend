import { DefaultRepository } from '../../common/default/default.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { ChapterEntity } from './chapter.entity';

@CustomRepository(ChapterEntity)
export class ChaptersRepository extends DefaultRepository<ChapterEntity> {}
