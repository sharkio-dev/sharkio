import { MigrationInterface, QueryRunner } from "typeorm";

export class MockResponseDelay1745000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.mock_response ADD delay int4 NOT NULL DEFAULT 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.mock_response DROP COLUMN delay;
    `);
  }
}
