import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  Relation,
} from "typeorm";
import { Users } from "./Users";

@Entity("users_workspaces", { schema: "public" })
export class WorkspacesUsers {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("uuid", { name: "workspace_id" })
  workspaceId: string;

  @ManyToOne(() => Users, (users) => users.mocks)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user?: Relation<Users>;
}
