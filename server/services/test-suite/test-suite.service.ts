import { TestSuiteRepository } from "../../model/test-suite/test-suite.model";

export class TestSuiteService {
  constructor(private readonly testSuiteRepository: TestSuiteRepository) {}

  async getByUserId(userId: string) {
    return this.testSuiteRepository.getByuserId(userId);
  }

  async create(name: string, userId: string) {
    return this.testSuiteRepository.create(name, userId);
  }

  async update(id: string, name: string) {
    return this.testSuiteRepository.update(id, name);
  }

  async getById(id: string) {
    return this.testSuiteRepository.getById(id);
  }

  async deleteById(id: string) {
    return this.testSuiteRepository.deleteById(id);
  }
}
