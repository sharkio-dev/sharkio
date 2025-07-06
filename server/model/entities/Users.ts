import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  Relation,
} from "typeorm";
import { ApiKey } from "./ApiKey";
import { Chat } from "./Chat";
import { Message } from "./Message";
import { Workspace } from "./Workspace";
import { WorkspacesUsers } from "./WorkspacesUsers";

@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("text", { name: "email", nullable: true })
  email: string | null;

  @Column("text", { name: "fullName", nullable: true })
  fullName: string | null;

  @Column("text", { name: "profileImg", nullable: true })
  profileImg: string | null;

  @Column("text", { name: "password", nullable: true })
  password: string | null;

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @JoinTable({
    name: "users_workspaces",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "workspace_id", referencedColumnName: "id" }],
    schema: "public",
  })
  workspaces: Workspace[];

  @OneToMany(() => WorkspacesUsers, (workspace) => workspace.user)
  workspacesUsers: Relation<WorkspacesUsers> | null;
}
