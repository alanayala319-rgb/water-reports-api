import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSystemUser1757000000001 implements MigrationInterface {
  name = 'CreateSystemUser1757000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "SYSTEM_USER" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "is_notification_enabled" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_SYSTEM_USER_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_SYSTEM_USER_email" UNIQUE ("email")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "SYSTEM_USER";`);
  }
}
