import { Column, Entity, Index } from "typeorm";

@Index("test_flow_node_pk", ["id"], { unique: true })
@Entity("test_flow_node", { schema: "public" })
export class TestFlowNode {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "flow_id", nullable: true })
  flowId: string | null;

  @Column("character varying", { name: "name", nullable: true })
  name: string | null;

  @Column("character varying", { name: "url", nullable: true })
  url: string | null;

  @Column("character varying", { name: "body", nullable: true })
  body: string | null;

  @Column("character varying", { name: "headers", nullable: true })
  headers: string | null;

  @Column("character varying", { name: "method", nullable: true })
  method: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;
}
