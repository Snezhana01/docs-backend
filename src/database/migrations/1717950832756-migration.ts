import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717950832756 implements MigrationInterface {
    name = 'Migration1717950832756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "FK_0155aad3e213584b446bf14a85b"`);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "genre" character varying NOT NULL, "annotations" character varying NOT NULL, "author_preferences" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0155aad3e213584b446bf14a85"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "REL_0155aad3e213584b446bf14a85"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "user_id" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_0155aad3e213584b446bf14a85" ON "uploads" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_d2211ba79c9312cdcda4d7d5860" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_d2211ba79c9312cdcda4d7d5860"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0155aad3e213584b446bf14a85"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "REL_0155aad3e213584b446bf14a85" UNIQUE ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_0155aad3e213584b446bf14a85" ON "uploads" ("user_id") `);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "FK_0155aad3e213584b446bf14a85b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
