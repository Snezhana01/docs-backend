import { isEmpty } from 'lodash';
import { Repository } from 'typeorm';

import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { UploadEntity } from './upload.entity';

@CustomRepository(UploadEntity)
export class UploadRepository extends Repository<UploadEntity> {
  async findNewFiles(fileIds: string[]): Promise<UploadEntity[]> {
    const joinedColumns = await this.getJoinedColumns();

    const query = this.createQueryBuilder('uploads');

    if (!isEmpty(joinedColumns)) {
      query.andWhere(`COALESCE(${joinedColumns}) IS NULL`);
    }

    if (!isEmpty(fileIds)) {
      query.andWhere('uploads.id IN (:...fileIds)', { fileIds });
    }

    const res = await query.getMany();

    return res;
  }

  async getFilesToRemove(): Promise<UploadEntity[]> {
    const joinedColumns = await this.getJoinedColumns();

    const query = this.createQueryBuilder('uploads');

    if (!isEmpty(joinedColumns)) {
      query.andWhere(`COALESCE(${joinedColumns}) IS NULL`);

      const res = await query.getMany();

      return res;
    }

    return [];
  }

  private async getJoinedColumns(): Promise<string[]> {
    const joinedColumns = await this.query(`
      SELECT column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage
          AS kcu ON tc.constraint_name = kcu.constraint_name
      WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = 'uploads'
    `);

    if (!isEmpty(joinedColumns)) {
      const columnNamesArray: string[] = joinedColumns.map(
        (value) => `"uploads"."${value.column_name}"`,
      );

      return columnNamesArray;
    }

    return [];
  }
}
