import { Column, Entity, Index } from "typeorm";

@Index("test_flow_edge_pk", ["id"], { unique: true })
@Entity("test_flow_edge", { schema: "public" })
export class TestFlowEdge {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "flow_id", nullable: true })
  flowId: string | null;

  @Column("uuid", { name: "source_node_id", nullable: true })
  sourceNodeId: string | null;

  @Column("uuid", { name: "target_node_id", nullable: true })
  targetNodeId: string | null;

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
