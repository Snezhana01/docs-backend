import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718021999665 implements MigrationInterface {
    name = 'Migration1718021999665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chapters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "text" text NOT NULL, "book_id" uuid NOT NULL, CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "book_id" uuid`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "UQ_a6aaa74155ca8632ab6d28d64e6" UNIQUE ("book_id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0155aad3e213584b446bf14a85"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "UQ_0155aad3e213584b446bf14a85b" UNIQUE ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_0155aad3e213584b446bf14a85" ON "uploads" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6aaa74155ca8632ab6d28d64e" ON "uploads" ("book_id") `);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "FK_0155aad3e213584b446bf14a85b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "FK_a6aaa74155ca8632ab6d28d64e6" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD CONSTRAINT "FK_23af8ea9e68fef63d07b189e8d1" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP CONSTRAINT "FK_23af8ea9e68fef63d07b189e8d1"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "FK_a6aaa74155ca8632ab6d28d64e6"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "FK_0155aad3e213584b446bf14a85b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6aaa74155ca8632ab6d28d64e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0155aad3e213584b446bf14a85"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "UQ_0155aad3e213584b446bf14a85b"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "user_id" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_0155aad3e213584b446bf14a85" ON "uploads" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "UQ_a6aaa74155ca8632ab6d28d64e6"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "book_id"`);
        await queryRunner.query(`DROP TABLE "chapters"`);
    }

}
