import { TestSuiteRepository } from "../../model/repositories/testSuite/testSuite.repository";

export class TestSuiteService {
  constructor(private readonly testSuiteRepository: TestSuiteRepository) {}

  async getByOwnerId(ownerId: string) {
    return this.testSuiteRepository.getByOwnerId(ownerId);
  }

  async create(name: string, ownerId: string) {
    return this.testSuiteRepository.create(name, ownerId);
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
