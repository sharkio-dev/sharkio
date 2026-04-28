import { MigrationInterface, QueryRunner } from "typeorm";

export class SnifferDisableRecording1746000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sniffer ADD disable_recording boolean NOT NULL DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sniffer DROP COLUMN disable_recording;
    `);
  }
}
