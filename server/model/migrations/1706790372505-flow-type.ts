import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372505 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE public.test_flow ADD "type" varchar NOT NULL DEFAULT 'flow'::character varying;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
