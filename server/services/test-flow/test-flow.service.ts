import { ParamsDictionary } from "express-serve-static-core";
import { CreateTestFlowDTO } from "../../dto/in/test-flow.dto";
import { TestFlowRepository } from "../../model/repositories/test-flow/testFlow.repository";
import { TestFlow } from "../../model/entities/test-flow/TestFlow";
import { TestFlowNode } from "../../model/entities/test-flow/TestFlowNode";

export class TestFlowService {
  constructor(private readonly repository: TestFlowRepository) {}

  createFlow(createFlowDTO: CreateTestFlowDTO) {
    return this.repository.create(createFlowDTO);
  }

  getByOwnerId(ownerId: string) {
    return this.repository.getByOwnerId(ownerId);
  }

  getById(ownerId: any, flowId: string) {
    return this.repository.getById(ownerId, flowId);
  }

  updateById(ownerId: any, flowId: any, testFlow: Partial<TestFlow>) {
    return this.repository.updateById(ownerId, flowId, testFlow);
  }

  deleteById(ownerId: any, flowId: string) {
    return this.repository.deleteById(ownerId, flowId);
  }

  createNode(
    ownerId: string,
    flowId: string,
    testFlowNode: Partial<TestFlowNode>,
  ) {
    return this.repository.createTestNode(ownerId, flowId, testFlowNode);
  }

  getNodesByFlowId(ownerId: any, flowId: string) {
    return this.repository.getNodesByFlowId(ownerId, flowId);
  }

  getEdgesByFlowId(ownerId: any, flowId: string) {
    return this.repository.getEdgesByFlowId(ownerId, flowId);
  }
}
