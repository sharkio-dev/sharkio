import { DataSource, Repository } from "typeorm";
import { Workspace } from "../entities/Workspace";

export class WorkspaceRepository {
  repository: Repository<Workspace>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Workspace);
  }

  async createNewWorkspace(workspaceName: string, userId: string) {
    const newWorkspace = this.repository.create({
      name: workspaceName,
      users: [{ id: userId }],
    });
    const savedWorkspace = await this.repository.save(newWorkspace);
    return savedWorkspace;
  }

  async getUserWorkspaces(userId: string) {
    const result = await this.repository
      .createQueryBuilder("workspace")
      .select("workspace")
      .innerJoin("workspace.users", "users")
      .where("users.id = :userId", { userId })
      .getMany();
    return result;
  }
  async deleteWorkspaceToUser(userId: string, workspaceId: string) {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from("users_workspaces")
      .where("user_id = :userId AND workspace_id = :workspaceId", {
        userId,
        workspaceId,
      })
      .execute();

    const isWorkspaceUsed = await this.repository
      .createQueryBuilder("workspace")
      .select("COUNT(*)")
      .innerJoin("workspace.users", "users")
      .where("workspace.id = :workspaceId", { workspaceId })
      .getCount();

    if (isWorkspaceUsed === 0) {
      this.repository.delete({ id: workspaceId });
    }
  }

  changeWorkspaceName(workspaceId: string, newWorkspaceName: string) {
    return this.repository.update(
      { id: workspaceId },
      { name: newWorkspaceName, updatedAt: new Date() },
    );
  }
}
