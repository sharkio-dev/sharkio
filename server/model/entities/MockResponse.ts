import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm";
import { Mock } from "./Mock";
import { Sniffer } from "./Sniffer";
import { Users } from "./Users";

@Index("mock_response_pk", ["id"], { unique: true })
@Entity("mock_response", { schema: "public" })
export class MockResponse {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("integer", { name: "status" })
  status: number;

  @Column("character varying", { name: "body", nullable: true })
  body: string | null;

  @Column("json", { name: "headers", nullable: true })
  headers: object | null;

  @Column("character varying", { name: "name", nullable: true })
  name: string | null;
  @Column({ name: "sniffer_id", type: "uuid" })
  snifferId: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "mock_id", type: "uuid" })
  mockId: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;

  @ManyToOne(() => Mock, (mock) => mock.mockResponses, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "mock_id", referencedColumnName: "id" }])
  mock: Relation<Mock>;
}
