import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE public.test_flow_node_run ADD COLUMN sub_flow_run_id uuid NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE public.test_flow_node_run DROP COLUMN sub_flow_run_id ;
  `);
  }
}
