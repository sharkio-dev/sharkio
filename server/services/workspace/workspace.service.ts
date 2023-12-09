import { UUID } from "crypto";
import { WorkspaceRepository } from "../../model/workSpace/workSpace.model";

export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async getWorkspace(userId: string, workspaceId: string) {
    return this.workspaceRepository.getById(userId, workspaceId);
  }

  async createWorkspace(workspaceName: string, userId: UUID) {
    const createdWorkspace = this.workspaceRepository.repository.create({
      name: workspaceName,
      userId,
    });
    console.log("createdWorkspace", createdWorkspace);
    const newWorkspace =
      this.workspaceRepository.saveWorkspace(createdWorkspace);

    return newWorkspace;
  }

  async getUserWorkspaces(userId: string) {
    return this.workspaceRepository.getUserWorkspaces(userId);
  }

  async deleteWorkspace(userId: string, workspaceId: string) {
    return this.workspaceRepository.deleteWorkspace(userId, workspaceId);
  }
  async changeWorkspaceName(
    userId: string,
    workspaceId: string,
    newWorkspaceName: string,
  ) {
    return this.workspaceRepository.changeWorkspaceName(
      userId,
      workspaceId,
      newWorkspaceName,
    );
  }
}
