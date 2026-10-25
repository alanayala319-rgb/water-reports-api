import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWaterReport1757000000000 implements MigrationInterface {
  name = 'CreateWaterReport1757000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "water_report_severity_enum" AS ENUM ('low', 'medium', 'high');
    `);

    await queryRunner.query(`
      CREATE TABLE "WATER_REPORT" (
        "id" SERIAL NOT NULL,
        "address" character varying NOT NULL,
        "description" character varying NOT NULL,
        "severity" "water_report_severity_enum" NOT NULL,
        "reporter_phone" character varying NOT NULL,
        "is_resolved" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_WATER_REPORT_id" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "WATER_REPORT";`);
    await queryRunner.query(`DROP TYPE "water_report_severity_enum";`);
  }
}
