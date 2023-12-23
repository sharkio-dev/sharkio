import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { ApiKey } from "./ApiKey";
import { Chat } from "./Chat";
import { Endpoint } from "./Endpoint";
import { Message } from "./Message";
import { Mock } from "./Mock";
import { Request } from "./Request";
import { Response } from "./Response";
import { TestSuite } from "./TestSuite";
import { Workspace } from "./Workspace";

@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class User {
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

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Endpoint, (endpoint) => endpoint.user)
  endpoints: Endpoint[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => Mock, (mock) => mock.user)
  mocks: Mock[];

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];

  @OneToMany(() => Response, (response) => response.user)
  responses: Response[];

  // @OneToMany(() => Sniffer, (sniffer) => sniffer.user)
  // sniffers: Sniffer[];

  @OneToMany(() => TestSuite, (testSuite) => testSuite.user)
  testSuites: TestSuite[];

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @JoinTable({
    name: "users_workspaces",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "workspace_id", referencedColumnName: "id" }],
    schema: "public",
  })
  workspaces: Workspace[];
}
