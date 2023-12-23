import { TextExecutionRepository } from "../../model/repositories/testSuite/testExecution.model";

export class TestExecutionService {
  constructor(
    private readonly testExecutionRepository: TextExecutionRepository,
  ) {}

  async create(testId: string) {
    return this.testExecutionRepository.create(testId);
  }

  async getByTestId(testIds: string[]) {
    return this.testExecutionRepository.getByTestId(testIds);
  }

  async deleteByTestId(testId: string) {
    return this.testExecutionRepository.deleteByTestId(testId);
  }

  async update(testId: string, checks: any) {
    return this.testExecutionRepository.update(testId, checks);
  }
}
