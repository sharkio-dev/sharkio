import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm";
import { Endpoint } from "./Endpoint";
import { TestExecution } from "./TestExecution";
import { Users } from "./Users";
import { Response } from "./Response";
import { Sniffer } from "./Sniffer";

@Index("invocation_pkey", ["id"], { unique: true })
@Entity("request", { schema: "public" })
export class Request {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "method" })
  method: string;

  @Column("text", { name: "url" })
  url: string;

  @Column("json", { name: "headers" })
  headers: object;

  @Column("text", { name: "body" })
  body: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("uuid", { name: "sniffer_id" })
  snifferId: string;

  @Column("uuid", { name: "test_execution_id", nullable: true })
  testExecutionId: string | null;

  @Column("uuid", { name: "endpoint_id" })
  endpointId: string;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.requests, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "endpoint_id", referencedColumnName: "id" }])
  endpoint: Relation<Endpoint>;

  @ManyToOne(() => TestExecution, (testExecution) => testExecution.request, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "test_execution_id", referencedColumnName: "id" }])
  testExecution: TestExecution;

  @ManyToOne(() => Users, (users) => users.requests)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Relation<Users>;

  @ManyToOne(() => Sniffer, (sniffer) => sniffer.requests, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sniffer_id", referencedColumnName: "id" }])
  sniffer: Promise<Sniffer>;

  @OneToMany(() => Response, (response) => response.request)
  responses: Response[];
}
