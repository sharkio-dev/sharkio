import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1706790372463 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            -- public.test_flow definition

            -- Drop table
            
            -- DROP TABLE public.test_flow;
            
            CREATE TABLE public.test_flow (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                created_at timestamptz NULL DEFAULT now(),
                updated_at timestamptz NULL DEFAULT now(),
                "name" text NULL,
                owner_id uuid NOT NULL,
                execution_type varchar NOT NULL DEFAULT 'sequence'::character varying,
                CONSTRAINT "PK_32d624ba5abc4eeb9b94efdf671" PRIMARY KEY (id)
            );
            CREATE UNIQUE INDEX test_flow_pk ON public.test_flow USING btree (id);
            
            
            -- public.test_flow_edge definition
            
            -- Drop table
            
            -- DROP TABLE public.test_flow_edge;
            
            CREATE TABLE public.test_flow_edge (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                flow_id uuid NULL,
                source_id uuid NULL,
                target_id uuid NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                updated_at timestamptz NOT NULL DEFAULT now(),
                owner_id uuid NULL,
                CONSTRAINT "PK_1e966278cff39232d77d68f8f9c" PRIMARY KEY (id)
            );
            CREATE UNIQUE INDEX test_flow_edge_pk ON public.test_flow_edge USING btree (id);
            
            
            -- public.test_flow_node definition
            
            -- Drop table
            
            -- DROP TABLE public.test_flow_node;
            
            CREATE TABLE public.test_flow_node (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                flow_id uuid NULL,
                "name" varchar NULL,
                url varchar NULL,
                body varchar NULL DEFAULT '{}'::character varying,
                headers json NULL DEFAULT '{}'::json,
                "method" varchar NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                updated_at timestamptz NOT NULL DEFAULT now(),
                assertions json NOT NULL DEFAULT '[]'::json,
                owner_id uuid NOT NULL,
                proxy_id uuid NOT NULL,
                subdomain varchar NULL,
                CONSTRAINT "PK_ce978c79bb13430cde734fd8095" PRIMARY KEY (id)
            );
            CREATE UNIQUE INDEX test_flow_node_pk ON public.test_flow_node USING btree (id);
            
            
            -- public.test_flow_node_run definition
            
            -- Drop table
            
            -- DROP TABLE public.test_flow_node_run;
            
            CREATE TABLE public.test_flow_node_run (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                flow_id uuid NULL,
                "name" varchar NULL,
                url varchar NULL,
                body varchar NULL DEFAULT '{}'::character varying,
                headers json NULL DEFAULT '{}'::json,
                "method" varchar NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                updated_at timestamptz NOT NULL DEFAULT now(),
                assertions json NOT NULL DEFAULT '[]'::json,
                owner_id uuid NOT NULL,
                proxy_id uuid NULL,
                subdomain varchar NULL,
                flow_run_id uuid NOT NULL,
                assertions_result json NULL DEFAULT '{}'::json,
                status text NOT NULL,
                node_id uuid NOT NULL,
                CONSTRAINT "PK_ce978c79bb13430cde734fd8095_1" PRIMARY KEY (id)
            );
            CREATE UNIQUE INDEX test_flow_node_pk_1 ON public.test_flow_node_run USING btree (id);
            
            
            -- public.test_flow_run definition
            
            -- Drop table
            
            -- DROP TABLE public.test_flow_run;
            
            CREATE TABLE public.test_flow_run (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                created_at timestamptz NULL DEFAULT now(),
                updated_at timestamptz NULL DEFAULT now(),
                "name" text NULL,
                owner_id uuid NOT NULL,
                started_at timestamptz NULL,
                finished_at timestamptz NULL,
                status text NOT NULL DEFAULT 'pending'::text,
                flow_id uuid NOT NULL,
                CONSTRAINT "PK_32d624ba5abc4eeb9b94efdf671_1" PRIMARY KEY (id)
            );
            CREATE UNIQUE INDEX test_flow_pk_1 ON public.test_flow_run USING btree (id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
