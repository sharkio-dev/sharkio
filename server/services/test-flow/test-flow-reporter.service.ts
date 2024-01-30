import { TestFlowNode } from "../../model/entities/test-flow/TestFlowNode";
import { TestFlowRun } from "../../model/entities/test-flow/TestFlowRun";
import { AssertionResult } from "./test-flow-executor/node-response-validator";
import { TestFlowService } from "./test-flow.service";

export class TestFlowReporter {
  constructor(private readonly testFlowService: TestFlowService) {}

  async reportNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    node: TestFlowNode,
    nodeRunResult: AssertionResult,
  ) {
    return this.testFlowService.addNodeRun(
      ownerId,
      flowId,
      flowRunId,
      node,
      nodeRunResult,
    );
  }
}
