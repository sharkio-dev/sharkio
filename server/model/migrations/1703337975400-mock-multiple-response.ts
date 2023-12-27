import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1703337975400 implements MigrationInterface {
  name = "Migrations1703337975400";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE public.mock_response (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          mock_id uuid NOT NULL,
          user_id uuid NOT NULL,
          sniffer_id uuid NOT NULL,
          status int4 NOT NULL,
          body varchar NULL,
          headers json NULL,
          "name" varchar NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT mock_response_pk PRIMARY KEY (id),
          CONSTRAINT mock_response_fk FOREIGN KEY (mock_id) REFERENCES public.mock(id) ON DELETE CASCADE,
          CONSTRAINT mock_response_fk_1 FOREIGN KEY (sniffer_id) REFERENCES public.sniffer(id) ON DELETE CASCADE
        );
        ALTER TABLE public.mock ADD current_mock_response_id uuid NULL;
        ALTER TABLE public.mock ADD CONSTRAINT mock_fk FOREIGN KEY (current_mock_response_id) REFERENCES public.mock_response(id);
        ALTER TABLE public.mock_response ADD CONSTRAINT mock_response_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.mock DROP CONSTRAINT mock_fk;
      ALTER TABLE public.mock DROP current_mock_response_id;
      DROP TABLE public.mock_response;
    `);
  }
}
