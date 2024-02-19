import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1706790372501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    ALTER TABLE public.mock DROP CONSTRAINT IF EXISTS "UQ_0b50d69c939cad1ed5e41b3dd7c";
    ALTER TABLE public.mock DROP CONSTRAINT IF EXISTS "UQ_cf5508816813ee9af33cbdc45d3";
    ALTER TABLE public.mock DROP CONSTRAINT IF EXISTS "UQ_abce14304d40b19d5df277aae25";    
    ALTER TABLE public.mock ADD CONSTRAINT "UQ_0b50d69c939cad1ed5e41b3dd7c" UNIQUE (method, url, sniffer_id);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
