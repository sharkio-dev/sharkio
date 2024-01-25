import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from "typeorm";
import { Request } from "./Request";
import { TestExecution } from "./TestExecution";
import { Users } from "./Users";
import { Sniffer } from "./Sniffer";

@Index("response_pk", ["id"], { unique: true })
@Entity("response", { schema: "public" })
export class Response {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "body", nullable: true })
  body: string;

  @Column("json", { name: "headers", nullable: true })
  headers: object;

  @Column("integer", { name: "status", nullable: true })
  status: number;

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

  @Column("uuid", { name: "request_id", nullable: true })
  requestId: string;

  @Column("uuid", { name: "test_execution_id", nullable: true })
  testExecutionId: string | null;

  @Column("uuid", { name: "owner_id", nullable: true })
  ownerId: string;

  @Column("uuid", { name: "sniffer_id", nullable: true })
  snifferId: string;

  @ManyToOne(() => Request, (request) => request.responses, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "request_id", referencedColumnName: "id" }])
  request: Relation<Request>;

  @ManyToOne(() => TestExecution, (testExecution) => testExecution.response, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "test_execution_id", referencedColumnName: "id" }])
  testExecution: Relation<TestExecution>;

  @ManyToOne(() => Sniffer, (sniffer) => sniffer.responses, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sniffer_id", referencedColumnName: "id" }])
  sniffer: Relation<Sniffer>;
}
