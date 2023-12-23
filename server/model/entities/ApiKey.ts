import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from "typeorm";
import { Users } from "./Users";

@Index("api_key_pkey", ["id"], { unique: true })
@Entity("api_key", { schema: "public" })
export class ApiKey {
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

  @Column("text", { name: "key" })
  key: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "status" })
  status: string;

  @ManyToOne(() => Users, async (user) => user.apiKeys)
  @JoinColumn({ name: "user_id" })
  user: Relation<Users>;
}
