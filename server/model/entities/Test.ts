import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TestSuite } from "./TestSuite";
import { TestExecution } from "./TestExecution";
import { Rule } from "../repositories/testSuite/types";

@Index("test_pkey", ["id"], { unique: true })
@Entity("test", { schema: "public" })
export class Test {
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
  name: string;

  @Column("text", { name: "url", nullable: true })
  url: string;

  @Column("text", { name: "body", nullable: true })
  body: string;

  @Column("json", { name: "headers", nullable: true })
  headers: object;

  @Column("text", { name: "method", nullable: true })
  method: string;

  @Column("json", { name: "rules", nullable: true })
  rules: Rule[];

  @Column("uuid", { name: "test_suite_id", nullable: true })
  testSuiteId: string | null;

  @Column("uuid", { name: "sniffer_id", nullable: true })
  snifferId: string;

  @ManyToOne(() => TestSuite, (testSuite) => testSuite.tests, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "test_suite_id", referencedColumnName: "id" }])
  testSuite: TestSuite;

  // @ManyToOne(() => Sniffer, (sniffer) => sniffer.id, {
  //   onDelete: "SET NULL",
  // })
  // @JoinColumn([{ name: "sniffer_id", referencedColumnName: "id" }])
  // sniffer: Relation<Sniffer>;

  @OneToMany(() => TestExecution, (testExecution) => testExecution.test)
  testExecutions: TestExecution[];
}
