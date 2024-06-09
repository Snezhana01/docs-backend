import { Column, Entity, Index } from 'typeorm';

import type { IDefaultEntity } from '../../common/default/default.entity';
import { DefaultEntity } from '../../common/default/default.entity';
import { UploadTypes } from './constants/upload-types.enum';

export interface IUploadEntity extends IDefaultEntity {
  fileName: string;

  originalFileName: string;

  mimeType: string;

  type: UploadTypes;
}

@Entity({ name: 'uploads' })
export class UploadEntity extends DefaultEntity implements IUploadEntity {
  @Column()
  fileName: string;

  @Column({ nullable: true })
  originalFileName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'character varying', nullable: false })
  type: UploadTypes;

  @Column({ nullable: true })
  order: number;

  @Index()
  @Column({ name: 'user_id', nullable: true })
  userId: string;
}
