import { DataSource, Repository } from "typeorm";
import { TestFlow } from "../../entities/test-flow/TestFlow";
import { CreateTestFlowDTO } from "../../../dto/in/create-test-flow.dto";

export class TestFlowRepository {
  repository: Repository<TestFlow>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(TestFlow);
  }

  create(testFlow: CreateTestFlowDTO) {
    const newTestFlow = this.repository.create({ ...testFlow });
    return this.repository.save(newTestFlow);
  }

  delete(ownerId: string, id: string) {
    return this.repository.delete({ ownerId, id });
  }
}
