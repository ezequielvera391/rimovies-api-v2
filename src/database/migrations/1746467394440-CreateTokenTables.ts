import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenTables1746467394440 implements MigrationInterface {
  name = 'CreateTokenTables1746467394440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "token" text NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "is_revoked" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "access_tokens" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "token" text NOT NULL,
        "jti" text NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "is_revoked" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_access_tokens_token" UNIQUE ("token"),
        CONSTRAINT "UQ_access_tokens_jti" UNIQUE ("jti"),
        CONSTRAINT "PK_access_tokens" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_token" ON "refresh_tokens" ("token")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_user_id_expires_at" ON "refresh_tokens" ("user_id", "expires_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_access_tokens_token" ON "access_tokens" ("token")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_access_tokens_user_id_expires_at" ON "access_tokens" ("user_id", "expires_at")
    `);

    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "access_tokens" 
      ADD CONSTRAINT "FK_access_tokens_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_tokens" DROP CONSTRAINT "FK_access_tokens_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_access_tokens_user_id_expires_at"`);
    await queryRunner.query(`DROP INDEX "IDX_access_tokens_token"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_user_id_expires_at"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_token"`);
    await queryRunner.query(`DROP TABLE "access_tokens"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
