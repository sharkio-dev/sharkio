import { Column, Entity, Index } from "typeorm";
import { TestFlowAssertion } from "../../../dto/in/test-flow.dto";

@Index("test_flow_node_pk", ["id"], { unique: true })
@Entity("test_flow_node", { schema: "public" })
export class TestFlowNode {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "owner_id" })
  ownerId: string;

  @Column("uuid", { name: "flow_id" })
  flowId: string;

  @Column("uuid", { name: "proxy_id" })
  proxyId: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "url" })
  url: string;

  @Column("text", { name: "body" })
  body: string;

  @Column("text", { name: "subdomain" })
  subdomain: string;

  @Column("json", { name: "headers" })
  headers: Record<string, string>;

  @Column("json", { name: "assertions" })
  assertions: Array<TestFlowAssertion>;

  @Column("text", { name: "method" })
  method: string;

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
