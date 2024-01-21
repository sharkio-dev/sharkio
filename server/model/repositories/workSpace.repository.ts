import { DataSource, Repository } from "typeorm";
import { Workspace } from "../entities/Workspace";
import { WorkspacesUsers } from "../entities/WorkspacesUsers";

export class WorkspaceRepository {
  repository: Repository<Workspace>;
  workSpacesUsersRepository: Repository<WorkspacesUsers>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Workspace);
    this.workSpacesUsersRepository =
      appDataSource.manager.getRepository(WorkspacesUsers);
  }

  getWorkspace(workspaceId: string) {
    return this.repository.findOne({ where: { id: workspaceId } });
  }

  async isMember(workspaceId: string, userId: string) {
    const user = await this.workSpacesUsersRepository.findOne({
      where: { workspaceId, userId },
    });
    return user != null;
  }

  async createNewWorkspace(workspaceName: string, userId: string) {
    const newWorkspace = this.repository.create({
      name: workspaceName,
      userId,
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
  async addUser(userId: any, workspaceId: string, newUserId: any) {
    const created = this.workSpacesUsersRepository.create({
      userId: newUserId,
      workspaceId,
    });
    return this.workSpacesUsersRepository.save(created);
  }

  async removeUser(userId: any, workspaceId: string) {
    const res = await this.workSpacesUsersRepository.delete({
      workspaceId,
      userId,
    });
    return res;
  }

  async getWorkspaceUsers(workspaceId: string) {
    const workspaceUsers = await this.workSpacesUsersRepository.find({
      where: {
        workspaceId,
      },
      select: {
        user: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      relations: {
        user: true,
      },
    });

    return workspaceUsers.map((workspaceUser) => workspaceUser.user);
  }
}
