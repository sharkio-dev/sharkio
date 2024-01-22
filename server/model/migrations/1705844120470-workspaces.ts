import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1705844120470 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
ALTER TABLE public.endpoint rename column user_id to owner_id;
ALTER TABLE public.mock rename column user_id to owner_id;
ALTER TABLE public.mock_response rename column user_id to owner_id;
ALTER TABLE public.request rename column user_id to owner_id;
ALTER TABLE public.response rename column user_id to owner_id;
ALTER TABLE public.sniffer rename column user_id to owner_id;
ALTER TABLE public.test_suite rename column user_id to owner_id;
ALTER TABLE public.sniffer DROP CONSTRAINT "FK_4912b7246be02f3ae913fe862a6";
COMMIT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
