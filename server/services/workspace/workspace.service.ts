import { WorkspaceRepository } from "../../model/workSpace/workSpace.model";

export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async getWorkspace(userId: string, workspaceId: string) {
    return this.workspaceRepository.getById(userId, workspaceId);
  }
}
