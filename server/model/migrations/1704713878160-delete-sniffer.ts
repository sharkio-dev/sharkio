import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteSniffer1704713878160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.mock DROP CONSTRAINT "FK_38fb1e691caee77454869f6b28e";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.mock ADD CONSTRAINT "FK_38fb1e691caee77454869f6b28e" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;`,
    );
    await queryRunner.query(`ALTER TABLE public.mock DROP CONSTRAINT mock_fk;`);
    await queryRunner.query(
      `ALTER TABLE public.mock ADD CONSTRAINT mock_fk FOREIGN KEY (selected_response_id) REFERENCES public.mock_response(id) ON DELETE SET NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD CONSTRAINT "FK_28efcc0598e0494eaffca41307e" FOREIGN KEY ("sniffer_id") REFERENCES "sniffer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.mock DROP CONSTRAINT "FK_38fb1e691caee77454869f6b28e";`,
    );
    await queryRunner.query(
      `ALTER TABLE "mock" ADD CONSTRAINT "FK_38fb1e691caee77454869f6b28e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE public.mock DROP CONSTRAINT mock_fk;`);
    await queryRunner.query(
      `ALTER TABLE public.mock ADD CONSTRAINT mock_fk FOREIGN KEY (selected_response_id) REFERENCES public.mock_response(id);`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" DROP CONSTRAINT "FK_28efcc0598e0494eaffca41307e"`,
    );
  }
}
