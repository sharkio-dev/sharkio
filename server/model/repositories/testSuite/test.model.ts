import { DataSource, Repository } from "typeorm";
import { Rule } from "./types";
import { Test } from "../../entities/Test";

export class TestRepository {
  private readonly repository: Repository<Test>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(Test);
  }

  getByTestSuiteId(testSuiteId: string) {
    return this.repository.find({ where: { testSuiteId } });
  }

  getByUrl(testSuiteId: string, url: string) {
    return this.repository.find({ where: { url, testSuiteId } });
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
    },
  ) {
    return this.repository.update(id, test);
  }

  async create(
    name: string,
    testSuiteId: string,
    snifferId: string,
    url: string,
    body: string,
    headers: Record<string, any>,
    method: string,
    rules?: Rule[],
  ): Promise<Test> {
    const newTest = this.repository.create({
      name,
      testSuiteId,
      snifferId,
      url,
      body,
      headers,
      method,
      rules: rules || [],
    });
    return this.repository.save(newTest);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  deleteById(id: string) {
    return this.repository.delete(id);
  }
}
