import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Request } from "./Request";
import { Response } from "./Response";
import { Test } from "./Test";

@Index("test_execution_pkey", ["id"], { unique: true })
@Entity("test_execution", { schema: "public" })
export class TestExecution {
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

  @Column("json", { name: "checks", nullable: true })
  checks: object | null;

  @Column("uuid", { name: "test_id", nullable: true })
  testId: string | null;

  @OneToMany(() => Request, (request) => request.testExecution)
  request: Request[];

  @OneToMany(() => Response, (response) => response.testExecution)
  response: Response[];

  @ManyToOne(() => Test, (test) => test.testExecutions, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "test_id", referencedColumnName: "id" }])
  test: Test;
}
