import { TestRepository } from "../../model/testSuite/test.model";
import { Rule } from "../../model/testSuite/types";

export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  create(
    name: string,
    testSuiteId: string,
    snifferId: string,
    url: string,
    body: string,
    headers: Record<string, any>,
    method: string,
    rules?: Rule[]
  ) {
    return this.testRepository.create(
      name,
      testSuiteId,
      snifferId,
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

  getByUrl(testSuiteId: string, url: string) {
    return this.testRepository.getByUrl(testSuiteId, url);
  }

  getById(id: string) {
    return this.testRepository.getById(id);
  }

  deleteById(id: string) {
    return this.testRepository.deleteById(id);
  }

  updateById(
    id: string,
    test: {
      name?: string;
      url?: string;
      body?: string;
      headers?: Record<string, any>;
      method?: string;
      rules?: Rule[];
    }
  ) {
    return this.testRepository.updateById(id, test);
  }
}
