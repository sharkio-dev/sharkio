import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
ALTER TABLE public.users_workspaces add column id uuid default gen_random_uuid();
COMMIT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
