import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717943298870 implements MigrationInterface {
    name = 'Migration1717943298870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uploads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_name" character varying NOT NULL, "original_file_name" character varying, "mime_type" character varying NOT NULL, "type" character varying NOT NULL, "order" integer, "user_id" uuid, CONSTRAINT "REL_0155aad3e213584b446bf14a85" UNIQUE ("user_id"), CONSTRAINT "PK_d1781d1eedd7459314f60f39bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0155aad3e213584b446bf14a85" ON "uploads" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "login" text NOT NULL, "password" text NOT NULL, "full_name" character varying, "birth_date" date, "role" character varying NOT NULL DEFAULT 'REDACTOR', CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
        await queryRunner.query(`ALTER TABLE "uploads" ADD CONSTRAINT "FK_0155aad3e213584b446bf14a85b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "FK_0155aad3e213584b446bf14a85b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0155aad3e213584b446bf14a85"`);
        await queryRunner.query(`DROP TABLE "uploads"`);
    }

}
