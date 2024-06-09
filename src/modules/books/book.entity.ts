import { DefaultEntity } from '@common/default/default.entity';
import { UserEntity } from '@modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

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
}
