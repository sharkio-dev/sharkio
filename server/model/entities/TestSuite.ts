import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm";
import { Test } from "./Test";
import { User } from "./Users";

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

  @Column("uuid", { name: "user_id", nullable: true })
  userId: string | null;

  @OneToMany(() => Test, (test) => test.testSuite)
  tests: Test[];

  @ManyToOne(() => User, (users) => users.testSuites)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Relation<User>;
}
