import { TextExecutionRepository } from "../../model/testSuite/testExecution.model";

export class TestExecutionService {
  constructor(
    private readonly testExecutionRepository: TextExecutionRepository
  ) {}

  async create(testId: string) {
    return this.testExecutionRepository.create(testId);
  }

  async getByTestId(testId: string) {
    return this.testExecutionRepository.getByTestId(testId);
  }
}
