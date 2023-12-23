import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1703332511084 implements MigrationInterface {
  name = "Migrations1703332511084";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying, "user_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mock" ("method" character varying, "url" character varying, "status" integer, "body" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" uuid NOT NULL DEFAULT gen_random_uuid(), "sniffer_id" uuid, "user_id" uuid, "is_active" boolean DEFAULT false, "headers" json, "name" character varying, CONSTRAINT "UQ_0b50d69c939cad1ed5e41b3dd7c" UNIQUE ("method"), CONSTRAINT "UQ_abce14304d40b19d5df277aae25" UNIQUE ("url"), CONSTRAINT "UQ_cf5508816813ee9af33cbdc45d3" UNIQUE ("sniffer_id"), CONSTRAINT "PK_374c21457ae3e56ec7d18d9e44e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "mock_un" ON "mock" ("method", "sniffer_id", "url") `,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "mock_pk" ON "mock" ("id") `);
    await queryRunner.query(
      `CREATE TABLE "response" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "body" text, "headers" json, "status" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "request_id" uuid, "test_execution_id" uuid, "user_id" uuid, "sniffer_id" uuid, CONSTRAINT "PK_f64544baf2b4dc48ba623ce768f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "response_pk" ON "response" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_suite" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text, "user_id" uuid, CONSTRAINT "PK_ed7acb97c9cf99bcfc888c6d0c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "test_suite_pkey" ON "test_suite" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text, "url" text, "body" text, "headers" json, "method" text, "rules" json, "test_suite_id" uuid, "sniffer_id" uuid, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "test_pkey" ON "test" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_execution" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "checks" json, "test_id" uuid, CONSTRAINT "PK_847a9a74c42fc0ff32aa82c3222" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "test_execution_pkey" ON "test_execution" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "request" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "method" text, "url" text, "headers" json, "body" text, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" uuid, "sniffer_id" uuid, "test_execution_id" uuid, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "endpoint_id" uuid, CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "invocation_pkey" ON "request" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "sniffer" ("name" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "downstream_url" character varying, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "subdomain" text NOT NULL DEFAULT gen_random_uuid(), "port" numeric, "user_id" uuid, CONSTRAINT "UQ_25c7f6ad9ddbe0419006afc914f" UNIQUE ("subdomain"), CONSTRAINT "PK_90358b9aea3c567ce25461de9e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "sniffer_subdomain_key" ON "sniffer" ("subdomain") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "sniffer_pkey" ON "sniffer" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "endpoint" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "method" text, "url" text, "headers" json, "body" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "sniffer_id" uuid, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "request_pkey" ON "endpoint" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "chat_id" uuid, "content" text, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" uuid, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "role" text, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workspace" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "workspace_pkey" ON "workspace" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" text, "fullName" text, "profileImg" text, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_pkey" ON "users" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "api_key" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" text, "user_id" uuid, "name" text, "status" text, CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "api_key_pkey" ON "api_key" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_flow_node" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "flow_id" uuid, "name" character varying, "url" character varying, "body" character varying, "headers" character varying, "method" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ce978c79bb13430cde734fd8095" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "test_flow_node_pk" ON "test_flow_node" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_flow" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "test_suite_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_32d624ba5abc4eeb9b94efdf671" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "test_flow_pk" ON "test_flow" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_flow_edge" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "flow_id" uuid, "source_node_id" uuid, "target_node_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1e966278cff39232d77d68f8f9c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "test_flow_edge_pk" ON "test_flow_edge" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_workspaces" ("user_id" uuid NOT NULL, "workspace_id" uuid NOT NULL, CONSTRAINT "PK_7fb6549163748beb1a2f2f87815" PRIMARY KEY ("user_id", "workspace_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d059c05372e25942b7512d7668" ON "users_workspaces" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c75d70032374c5edef8ca466bc" ON "users_workspaces" ("workspace_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_15d83eb496fd7bec7368b30dbf3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mock" ADD CONSTRAINT "FK_38fb1e691caee77454869f6b28e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mock" ADD CONSTRAINT "FK_cf5508816813ee9af33cbdc45d3" FOREIGN KEY ("sniffer_id") REFERENCES "sniffer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_0799adb0ae11661f7afb4a75496" FOREIGN KEY ("request_id") REFERENCES "request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_026b8f03ccaa4e5d3121cb5ba40" FOREIGN KEY ("test_execution_id") REFERENCES "test_execution"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_cb08b448b768de23c7b986b4029" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_1c748a494957a52728cc1e10265" FOREIGN KEY ("sniffer_id") REFERENCES "sniffer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_suite" ADD CONSTRAINT "FK_4510235b875edeab48a1183252a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD CONSTRAINT "FK_974ef79391b20d3ed23a2326fb1" FOREIGN KEY ("test_suite_id") REFERENCES "test_suite"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD CONSTRAINT "FK_28efcc0598e0494eaffca41307e" FOREIGN KEY ("sniffer_id") REFERENCES "sniffer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_execution" ADD CONSTRAINT "FK_282d02b96a99f3f3dde6c03460b" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_d7b3bac8b410b0c640b8f15b16f" FOREIGN KEY ("endpoint_id") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_5f075534a839daa55850022acd3" FOREIGN KEY ("test_execution_id") REFERENCES "test_execution"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_3a3d93f532a056b0d89d09cdd21" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_95fd1b40aa4b174f37a6b60248c" FOREIGN KEY ("sniffer_id") REFERENCES "sniffer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sniffer" ADD CONSTRAINT "FK_4912b7246be02f3ae913fe862a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "endpoint" ADD CONSTRAINT "FK_e197baa1e08f5c75e7e34688040" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "endpoint" ADD CONSTRAINT "FK_566219de4f54b2202f8647c34d4" FOREIGN KEY ("sniffer_id") REFERENCES "sniffer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_54ce30caeb3f33d68398ea10376" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key" ADD CONSTRAINT "FK_6a0830f03e537b239a53269b27d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspaces" ADD CONSTRAINT "FK_d059c05372e25942b7512d76688" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspaces" ADD CONSTRAINT "FK_c75d70032374c5edef8ca466bc5" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_workspaces" DROP CONSTRAINT "FK_c75d70032374c5edef8ca466bc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspaces" DROP CONSTRAINT "FK_d059c05372e25942b7512d76688"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key" DROP CONSTRAINT "FK_6a0830f03e537b239a53269b27d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_54ce30caeb3f33d68398ea10376"`,
    );
    await queryRunner.query(
      `ALTER TABLE "endpoint" DROP CONSTRAINT "FK_566219de4f54b2202f8647c34d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "endpoint" DROP CONSTRAINT "FK_e197baa1e08f5c75e7e34688040"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sniffer" DROP CONSTRAINT "FK_4912b7246be02f3ae913fe862a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_95fd1b40aa4b174f37a6b60248c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_3a3d93f532a056b0d89d09cdd21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_5f075534a839daa55850022acd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_d7b3bac8b410b0c640b8f15b16f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_execution" DROP CONSTRAINT "FK_282d02b96a99f3f3dde6c03460b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" DROP CONSTRAINT "FK_28efcc0598e0494eaffca41307e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" DROP CONSTRAINT "FK_974ef79391b20d3ed23a2326fb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_suite" DROP CONSTRAINT "FK_4510235b875edeab48a1183252a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_1c748a494957a52728cc1e10265"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_cb08b448b768de23c7b986b4029"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_026b8f03ccaa4e5d3121cb5ba40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_0799adb0ae11661f7afb4a75496"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mock" DROP CONSTRAINT "FK_cf5508816813ee9af33cbdc45d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mock" DROP CONSTRAINT "FK_38fb1e691caee77454869f6b28e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_15d83eb496fd7bec7368b30dbf3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c75d70032374c5edef8ca466bc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d059c05372e25942b7512d7668"`,
    );
    await queryRunner.query(`DROP TABLE "users_workspaces"`);
    await queryRunner.query(`DROP INDEX "public"."test_flow_edge_pk"`);
    await queryRunner.query(`DROP TABLE "test_flow_edge"`);
    await queryRunner.query(`DROP INDEX "public"."test_flow_pk"`);
    await queryRunner.query(`DROP TABLE "test_flow"`);
    await queryRunner.query(`DROP INDEX "public"."test_flow_node_pk"`);
    await queryRunner.query(`DROP TABLE "test_flow_node"`);
    await queryRunner.query(`DROP INDEX "public"."api_key_pkey"`);
    await queryRunner.query(`DROP TABLE "api_key"`);
    await queryRunner.query(`DROP INDEX "public"."users_pkey"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."workspace_pkey"`);
    await queryRunner.query(`DROP TABLE "workspace"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP INDEX "public"."request_pkey"`);
    await queryRunner.query(`DROP TABLE "endpoint"`);
    await queryRunner.query(`DROP INDEX "public"."sniffer_pkey"`);
    await queryRunner.query(`DROP INDEX "public"."sniffer_subdomain_key"`);
    await queryRunner.query(`DROP TABLE "sniffer"`);
    await queryRunner.query(`DROP INDEX "public"."invocation_pkey"`);
    await queryRunner.query(`DROP TABLE "request"`);
    await queryRunner.query(`DROP INDEX "public"."test_execution_pkey"`);
    await queryRunner.query(`DROP TABLE "test_execution"`);
    await queryRunner.query(`DROP INDEX "public"."test_pkey"`);
    await queryRunner.query(`DROP TABLE "test"`);
    await queryRunner.query(`DROP INDEX "public"."test_suite_pkey"`);
    await queryRunner.query(`DROP TABLE "test_suite"`);
    await queryRunner.query(`DROP INDEX "public"."response_pk"`);
    await queryRunner.query(`DROP TABLE "response"`);
    await queryRunner.query(`DROP INDEX "public"."mock_pk"`);
    await queryRunner.query(`DROP INDEX "public"."mock_un"`);
    await queryRunner.query(`DROP TABLE "mock"`);
    await queryRunner.query(`DROP TABLE "chat"`);
  }
}
