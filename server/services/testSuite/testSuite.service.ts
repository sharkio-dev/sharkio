import { TestSuiteRepository } from "../../model/testSuite/testSuite.model";

export class TestSuiteService {
  constructor(private readonly testSuiteRepository: TestSuiteRepository) {}

  async getByUserId(userId: string) {
    return this.testSuiteRepository.getByuserId(userId);
  }

  async create(name: string, userId: string) {
    return this.testSuiteRepository.create(name, userId);
  }
}
