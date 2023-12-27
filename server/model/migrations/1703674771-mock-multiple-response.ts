import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1703332511084 implements MigrationInterface {
  name = "Migrations1703332511084";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE public.mock_response (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          mock_id uuid NOT NULL,
          sniffer_id uuid NOT NULL,
          status int4 NOT NULL,
          body varchar NULL,
          headers json NULL,
          CONSTRAINT mock_response_pk PRIMARY KEY (id),
          CONSTRAINT mock_response_fk FOREIGN KEY (mock_id) REFERENCES public.mock(id) ON DELETE CASCADE,
          CONSTRAINT mock_response_fk_1 FOREIGN KEY (sniffer_id) REFERENCES public.sniffer(id) ON DELETE CASCADE
        );
        ALTER TABLE public.mock ADD current_mock_response_id uuid NULL;
        ALTER TABLE public.mock ADD CONSTRAINT mock_fk FOREIGN KEY (current_mock_response_id) REFERENCES public.mock_response(id);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.mock_response;
      ALTER TABLE public.mock ADD current_mock_response_id uuid NULL;
      ALTER TABLE public.mock ADD CONSTRAINT mock_fk FOREIGN KEY (current_mock_response_id) REFERENCES public.mock_response(id);
    `);
  }
}
