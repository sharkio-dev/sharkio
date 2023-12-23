import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Users } from "./Users";
import { Request } from "./Request";

@Index("request_pkey", ["id"], { unique: true })
@Entity("endpoint", { schema: "public" })
export class Endpoint {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "method", nullable: true })
  method: string;

  @Column("text", { name: "url", nullable: true })
  url: string;

  @Column("json", { name: "headers", nullable: true })
  headers: Record<string, string>;

  @Column("text", { name: "body", nullable: true })
  body: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("uuid", { name: "user_id", nullable: true })
  userId: string;

  @Column("uuid", { name: "sniffer_id", nullable: true })
  snifferId: string;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.endpoints)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  // @ManyToOne(() => Sniffer, (sniffer) => sniffer.endpoints, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn([{ name: "sniffer_id", referencedColumnName: "id" }])
  // sniffer: Sniffer;

  @OneToMany(() => Request, (request) => request.endpoint)
  requests: Request[];
}
