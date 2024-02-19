import { Column, Entity, Index } from "typeorm";

@Index("test_flow_pk", ["id"], { unique: true })
@Entity("test_flow", { schema: "public" })
export class TestFlow {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", {
    name: "name",
  })
  name: string;

  @Column("text", {
    name: "execution_type",
  })
  executionType: string;

  @Column("uuid", { name: "owner_id", nullable: true })
  ownerId: string | null;

  @Column("text", {
    name: "type",
    default: "flow",
  })
  type: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;
}
