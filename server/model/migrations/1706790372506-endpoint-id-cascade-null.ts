import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE public.request DROP CONSTRAINT IF EXISTS "FK_d7b3bac8b410b0c640b8f15b16f";
    ALTER TABLE public.request ADD CONSTRAINT "FK_d7b3bac8b410b0c640b8f15b16f" FOREIGN KEY (endpoint_id) REFERENCES public.endpoint(id) ON DELETE SET NULL;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
