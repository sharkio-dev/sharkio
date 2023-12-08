import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";

import { useLog } from "../../lib/log";

// ? what is this for?
const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

// ? the workspace in the db is in the public schemas
// ? i think it should be in the auth schema with user relation
@Entity({ name: "workspace", schema: "auth" })
export class Workspace {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ name: "user_id" })
  userId: string;
  //? how to make the relationship

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_open" })
  isOpen: boolean;
}

//   @ManyToOne(() => User, user => user.workspaces)
//   user: User;

//   @OneToMany(() => Workspace, workspace => workspace.user)
//   workspaces: Workspace[];
