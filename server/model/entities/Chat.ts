import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./Users";

@Entity("chat", { schema: "public" })
export class Chat {
  @PrimaryColumn("uuid", { name: "id", default: () => "gen_random_uuid()" })
  id: string;

  @Column("character varying", { name: "title", nullable: true })
  title: string | null;

  @Column("uuid", { name: "user_id", nullable: true })
  userId: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;

  @ManyToOne(() => User, (users) => users.chats)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Promise<User>;
}
