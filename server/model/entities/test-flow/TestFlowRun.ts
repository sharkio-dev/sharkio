import { Column, Entity, Index } from "typeorm";
import { TestFlowEdge } from "./TestFlowEdge";

@Index("test_flow_run_pk", ["id"], { unique: true })
@Entity("test_flow_run", { schema: "public" })
export class TestFlowRun {
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

  @Column("timestamp with time zone", {
    name: "started_at",
    nullable: true,
    default: () => "now()",
  })
  startedAt: Date;

  @Column("timestamp with time zone", {
    name: "finished_at",
    nullable: true,
    default: () => "now()",
  })
  finishedAt: Date;

  @Column("text")
  status: string;

  @Column("json")
  edges: TestFlowEdge[];

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date;
}

export const FlowRunStatus = {
  pending: "pending",
  running: "running",
  success: "success",
  failed: "failed",
  error: "error",
} as const;
