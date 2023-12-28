import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm";
import { Users } from "./Users";
import { Sniffer } from "./Sniffer";
import { MockResponse } from "./MockResponse";

@Index("mock_pk", ["id"], { unique: true })
@Index("mock_un", ["method", "snifferId", "url"], { unique: true })
@Entity("mock", { schema: "public" })
export class Mock {
  @Column("character varying", { name: "method", nullable: true, unique: true })
  method: string;

  @Column("character varying", { name: "url", nullable: true, unique: true })
  url: string;

  @Column("integer", { name: "status", nullable: true })
  status: number;

  @Column("character varying", { name: "body", nullable: true })
  body: string;

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

  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "sniffer_id", nullable: true, unique: true })
  snifferId: string;

  @Column("uuid", { name: "user_id", nullable: true })
  userId: string;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "false",
  })
  isActive: boolean;

  @Column("json", { name: "headers", nullable: true })
  headers: object;

  @Column("character varying", { name: "name", nullable: true })
  name: string;

  @Column({ name: "selected_response_id", nullable: true })
  selectedResponseId: string;

  @Column({
    name: "response_selection_method",
    nullable: false,
    default: "default",
  })
  responseSelectionMethod: string;

  @ManyToOne(() => Users, (users) => users.mocks)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Relation<Users>;

  @ManyToOne(() => Sniffer, (sniffer) => sniffer.mocks, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "sniffer_id", referencedColumnName: "id" }])
  sniffer: Relation<Sniffer>;

  @OneToMany(() => MockResponse, (mockResponse) => mockResponse.mock)
  mockResponses: MockResponse[];
}
