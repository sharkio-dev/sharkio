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

  @Column("uuid", { name: "flow_id" })
  flowId: string;

  @Column("uuid", { name: "owner_id" })
  ownerId: string;

  @Column("uuid", { name: "source_id" })
  sourceId: string;

  @Column("uuid", { name: "target_id" })
  targetId: string;

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
