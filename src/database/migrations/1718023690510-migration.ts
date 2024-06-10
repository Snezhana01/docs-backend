import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718023690510 implements MigrationInterface {
    name = 'Migration1718023690510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "text" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "text" DROP DEFAULT`);
    }

}
