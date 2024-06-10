import { DefaultEntity } from '@common/default/default.entity';
import { UploadEntity } from '@modules/upload/upload.entity';
import { UserEntity } from '@modules/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';

@Entity({ name: 'books' })
export class BookEntity extends DefaultEntity {
  @Column({ type: 'character varying' })
  name: string;

  @Column({ type: 'character varying' })
  genre: string;

  @Column({ type: 'character varying' })
  annotations: string;

  @Column({ type: 'character varying' })
  authorPreferences: string;

  @Column({ type: 'uuid' })
  readonly userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  readonly user: Relation<UserEntity>;

  @OneToOne(() => UploadEntity, (entity) => entity.book)
  readonly cover: Relation<UploadEntity>;
}
