import { CreateTestFlowDTO } from "../../dto/in/test-flow.dto";
import { TestFlow } from "../../model/entities/test-flow/TestFlow";
import { TestFlowNode } from "../../model/entities/test-flow/TestFlowNode";
import { TestFlowRun } from "../../model/entities/test-flow/TestFlowRun";
import { TestFlowRepository } from "../../model/repositories/test-flow/testFlow.repository";
import { AssertionResult } from "./test-flow-executor/node-response-validator";

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

  createTestFlowRun(
    ownerId: string,
    flowId: string,
    testFlowRun: Partial<TestFlowRun>,
  ) {
    return this.repository.createFlowRun(ownerId, flowId, testFlowRun);
  }

  updateFlowRun(
    ownerId: string,
    flowRunId: string,
    testFlowRun: Partial<TestFlowRun>,
  ) {
    return this.repository.updateTestFlowRun(ownerId, flowRunId, testFlowRun);
  }

  addNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    node: TestFlowNode,
    nodeRunResult: AssertionResult,
  ) {
    return this.repository.addNodeRun(ownerId, flowId, flowRunId, node, {
      assertionsResult: nodeRunResult,
      status: nodeRunResult.success ? "success" : "failed",
    });
  }

  getFlowRuns(ownerId: any, flowId: string) {
    return this.repository.getFlowRuns(ownerId, flowId);
  }

  getFlowRun(ownerId: any, flowId: string, runId: string) {
    return this.repository.getFlowRun(ownerId, flowId, runId);
  }

  getFlowRunNodes(ownerId: any, flowId: string, runId: string) {
    return this.repository.getFlowRunNodes(ownerId, flowId, runId);
  }
}
