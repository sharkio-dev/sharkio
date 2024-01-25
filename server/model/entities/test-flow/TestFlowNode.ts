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

  @Column("uuid", { name: "flow_id" })
  flowId: string | null;

  @Column("uuid", { name: "proxy_id" })
  proxyId: string | null;

  @Column("text", { name: "name" })
  name: string | null;

  @Column("text", { name: "url" })
  url: string | null;

  @Column("text", { name: "body" })
  body: string | null;

  @Column("text", { name: "headers" })
  headers: string | null;

  @Column("text", { name: "method" })
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
