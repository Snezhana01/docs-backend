import { DefaultEntity } from '@common/default/default.entity';
import { BookEntity } from '@modules/books/book.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

@Entity({ name: 'chapters' })
export class ChapterEntity extends DefaultEntity {
  @Column({ type: 'character varying' })
  name: string;

  @Column({ type: 'text', default: '' })
  text: string;

  @Column({ type: 'uuid' })
  readonly bookId: string;

  @ManyToOne(() => BookEntity)
  @JoinColumn()
  readonly book: Relation<BookEntity>;

  @DeleteDateColumn()
  readonly deletedAt: Date;
}
