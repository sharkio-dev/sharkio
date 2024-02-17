import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE public.request DROP CONSTRAINT IF EXISTS "FK_3a3d93f532a056b0d89d09cdd21";
    ALTER TABLE public.response DROP CONSTRAINT IF EXISTS "FK_cb08b448b768de23c7b986b4029";
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
