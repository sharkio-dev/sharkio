import {
  Column,
  DataSource,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  Repository,
} from "typeorm";

import { useLog } from "../../lib/log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "users_workspaces", schema: "public" })
export class UsersWorkspaces {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  workspaceId: string;
}
