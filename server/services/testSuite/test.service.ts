import { TestRepository } from "../../model/testSuite/test.model";
import { Rule } from "../../model/testSuite/types";

export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  create(
    name: string,
    testSuiteId: string,
    url: string,
    body: Record<string, any>,
    headers: Record<string, any>,
    method: string,
    rules?: Rule[]
  ) {
    return this.testRepository.create(
      name,
      testSuiteId,
      url,
      body,
      headers,
      method,
      rules
    );
  }

  getByTestSuiteId(id: string) {
    return this.testRepository.getByTestSuiteId(id);
  }

  getById(id: string) {
    return this.testRepository.getById(id);
  }

  deleteById(id: string) {
    return this.testRepository.deleteById(id);
  }
}
