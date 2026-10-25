import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportPhotos1792800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "WATER_REPORT" ADD COLUMN "photo_url" text');
    await queryRunner.query('ALTER TABLE "WATER_REPORT" ADD COLUMN "repair_photo_url" text');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "WATER_REPORT" DROP COLUMN "repair_photo_url"');
    await queryRunner.query('ALTER TABLE "WATER_REPORT" DROP COLUMN "photo_url"');
  }
}
