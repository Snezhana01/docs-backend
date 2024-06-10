import { Nullable } from '@common/types';
import { UploadEntity } from '@modules/upload/upload.entity';
import { Column, Entity, Index, OneToOne, Relation } from 'typeorm';

import { DefaultEntity } from '../../common/default/default.entity';
import { RoleType } from '../../constants';

@Entity({ name: 'users' })
export class UserEntity extends DefaultEntity {
  @Column({ type: 'text', unique: true })
  login: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ nullable: true, type: 'character varying' })
  fullName: Nullable<string>;

  @Column({ type: 'date', nullable: true })
  birthDate: Nullable<Date>;

  @Index()
  @Column({
    type: 'character varying',
    enum: RoleType,
    enumName: 'RoleType',
    default: RoleType.REDACTOR,
  })
  role: RoleType;

  @OneToOne(() => UploadEntity, (entity) => entity.user)
  readonly avatar: Relation<UploadEntity>;
}
