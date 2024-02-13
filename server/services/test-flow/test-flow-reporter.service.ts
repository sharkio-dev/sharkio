import { TestFlowNode } from "../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../model/entities/test-flow/TestFlowNodeRun";
import { TestFlowRun } from "../../model/entities/test-flow/TestFlowRun";
import { AssertionResult } from "./test-flow-executor/node-response-validator";
import { TestFlowService } from "./test-flow.service";

export class TestFlowReporter {
  constructor(private readonly testFlowService: TestFlowService) {}

  async reportNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodeRun: TestFlowNodeRun,
    nodeRunResult: AssertionResult,
    response: any,
  ) {
    return this.testFlowService.updateNodeRun(
      ownerId,
      flowId,
      flowRunId,
      nodeRun.id,
      nodeRunResult,
      {
        status: nodeRunResult.success ? "success" : "failed",
        finishedAt: new Date(),
        response,
      },
    );
  }
}
