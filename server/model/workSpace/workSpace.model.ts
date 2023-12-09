import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";

import { useLog } from "../../lib/log";

// ? what is this for?
const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "workspace", schema: "public" })
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
    const moveToWorkspace = this.repository.findOne({
      where: { id: workspaceId, userId },
    });
    if (moveToWorkspace === null) {
      return;
    }
    this.repository.update({ isOpen: true }, { isOpen: false });
    this.repository.update({ id: workspaceId, userId }, { isOpen: true });
    return;
  }

  saveWorkspace(workspace: Workspace) {
    return this.repository.save(workspace);
  }

  getUserWorkspaces(userId: string) {
    return this.repository.find({ where: { userId } });
  }
  deleteWorkspace(userId: string, workspaceId: string) {
    return this.repository.delete({ id: workspaceId, userId });
  }

  changeWorkspaceName(
    userId: string,
    workspaceId: string,
    newWorkspaceName: string,
  ) {
    return this.repository.update(
      { id: workspaceId, userId },
      { name: newWorkspaceName },
    );
  }
}
