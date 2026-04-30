import { MigrationInterface, QueryRunner } from "typeorm";

export class SnifferFileConfigOutputDir1747000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sniffer ADD file_config_output_dir character varying NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sniffer DROP COLUMN file_config_output_dir;
    `);
  }
}
