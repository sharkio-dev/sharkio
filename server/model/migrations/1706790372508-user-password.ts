import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE public.users ADD "password" varchar NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE public.users DROP COLUMN password;
  `);
  }
}
