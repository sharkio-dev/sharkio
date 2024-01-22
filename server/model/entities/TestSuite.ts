import { Column, Entity, Index, OneToMany } from "typeorm";
import { Test } from "./Test";

@Index("test_suite_pkey", ["id"], { unique: true })
@Entity("test_suite", { schema: "public" })
export class TestSuite {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("text", { name: "name", nullable: true })
  name: string | null;

  @Column("uuid", { name: "owner_id", nullable: true })
  ownerId: string | null;

  @OneToMany(() => Test, (test) => test.testSuite)
  tests: Test[];
}
