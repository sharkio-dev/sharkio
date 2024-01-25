import { CreateTestFlowDTO } from "../../dto/in/create-test-flow.dto";
import { TestFlowRepository } from "../../model/repositories/test-flow/testFlow.repository";

export class TestFlowService {
  constructor(private readonly repository: TestFlowRepository) {}

  createFlow(createFlowDTO: CreateTestFlowDTO) {
    return this.repository.create(createFlowDTO);
  }
}
