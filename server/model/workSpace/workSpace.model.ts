import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";

import { useLog } from "../../lib/log";

// ? what is this for?
const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "workspace", schema: "auth" })
export class Workspace {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ name: "user_id" })
  userId: string;

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

export class WorkspaceRepository {
  repository: Repository<Workspace>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Workspace);
  }

  getById(userId: string, workspaceId: string) {
    return this.repository.findOne({ where: { id: workspaceId, userId } });
  }
}
