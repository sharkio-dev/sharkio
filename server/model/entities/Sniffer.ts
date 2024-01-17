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
import { Mock } from "./Mock";
import { Request } from "./Request";
import { Response } from "./Response";
import { Users } from "./Users";
import { Test } from "./Test";
import { MockResponse } from "./MockResponse";

@Index("sniffer_pkey", ["id"], { unique: true })
@Index("sniffer_subdomain_key", ["subdomain"], { unique: true })
@Entity("sniffer", { schema: "public" })
export class Sniffer {
  @Column("character varying", { name: "name", nullable: true })
  name: string | null;

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

  @Column("character varying", { name: "downstream_url", nullable: true })
  downstreamUrl: string;

  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", {
    name: "subdomain",
    unique: true,
    default: () => "gen_random_uuid()",
  })
  subdomain: string;

  @Column("numeric", { name: "port", nullable: true })
  port: number;

  @Column("uuid", { name: "user_id", nullable: true })
  userId: string;

  @Column("is_mocking_enabled", {
    name: "is_mocking_enabled",
    default: false,
    type: "boolean",
  })
  isMockingEnabled: boolean;

  @OneToMany(() => Endpoint, (endpoint) => endpoint.id)
  endpoints: Endpoint[];

  @OneToMany(() => Mock, (mock) => mock.id)
  mocks: Mock[];

  @OneToMany(() => Request, (request) => request.snifferId)
  requests: Request[];

  @OneToMany(() => Response, (response) => response.id)
  responses: Response[];

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user?: Relation<Users>;

  @OneToMany(() => Test, (test) => test.id)
  tests: Test[];

  @OneToMany(() => MockResponse, (mockResponse) => mockResponse.snifferId)
  mockResponses: MockResponse[];
}
