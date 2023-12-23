import { DataSource, In, Repository } from "typeorm";
import { TestExecution } from "../../entities/TestExecution";

export class TextExecutionRepository {
  private readonly repository: Repository<TestExecution>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestExecution);
  }

  create(testId: string) {
    return this.repository.save({
      testId,
    });
  }

  getByTestId(testIds: string[]) {
    return this.repository.find({
      where: { testId: In(testIds) },
      relations: {
        test: true,
        request: {
          responses: true,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  deleteByTestId(testId: string) {
    return this.repository.delete({ testId });
  }

  update(testId: string, checks: any) {
    return this.repository.update({ id: testId }, { checks });
  }
}
