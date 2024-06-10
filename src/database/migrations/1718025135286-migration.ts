import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718025135286 implements MigrationInterface {
    name = 'Migration1718025135286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "deleted_at"`);
    }

}
