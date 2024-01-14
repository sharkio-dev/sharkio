import { Column, Entity, Index, ManyToMany } from "typeorm";

@Entity("workspaces_users", { schema: "public" })
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
}
