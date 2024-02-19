import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372504 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE request ALTER COLUMN endpoint_id DROP NOT NULL;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
