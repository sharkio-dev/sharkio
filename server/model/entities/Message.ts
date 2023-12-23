import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { User } from "./Users";

@Entity("message", { schema: "public" })
export class Message {
  @PrimaryColumn("uuid", { name: "id", default: () => "gen_random_uuid()" })
  id: string;

  @Column("uuid", { name: "chat_id", nullable: true })
  chatId: string | null;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("uuid", { name: "user_id", nullable: true })
  userId: string | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;

  @Column("text", { name: "role", nullable: true })
  role: string | null;

  @ManyToOne(() => User, (users) => users.messages)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Relation<User>;
}
