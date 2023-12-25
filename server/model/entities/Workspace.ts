import { Column, Entity, Index, ManyToMany } from "typeorm";
import { Users } from "./Users";

@Index("workspace_pkey", ["id"], { unique: true })
@Entity("workspace", { schema: "public" })
export class Workspace {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @ManyToMany(() => Users, (users) => users.workspaces)
  users: Users[];
}
