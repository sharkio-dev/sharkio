import { DataSource, Repository } from "typeorm";
import { TestSuite } from "../../entities/TestSuite";

export class TestSuiteRepository {
  private readonly repository: Repository<TestSuite>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestSuite);
  }

  getByOwnerId(ownerId: string) {
    return this.repository.find({ where: { ownerId } });
  }

  async create(name: string, ownerId: string): Promise<TestSuite> {
    const newTestSuite = this.repository.create({ name, ownerId });
    return this.repository.save(newTestSuite);
  }

  async update(id: string, name: string): Promise<TestSuite> {
    const testSuite = await this.repository.findOne({ where: { id } });
    if (!testSuite) {
      throw new Error("Test suite not found");
    }
    testSuite.name = name;
    return this.repository.save(testSuite);
  }

  async getById(id: string): Promise<TestSuite> {
    const testSuite = await this.repository.findOne({ where: { id } });
    if (!testSuite) {
      throw new Error("Test suite not found");
    }
    return testSuite;
  }

  async deleteById(id: string): Promise<void> {
    const testSuite = await this.repository.findOne({ where: { id } });
    if (!testSuite) {
      throw new Error("Test suite not found");
    }
    await this.repository.delete(id);
  }
}
