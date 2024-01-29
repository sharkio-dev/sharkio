import { AxiosResponse } from "axios";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowService } from "../test-flow.service";
import { FlowRunStatus } from "../../../model/entities/test-flow/TestFlowRun";
import {
  AssertionResult,
  NodeResponseValidator,
} from "./node-response-validator";
import { result } from "lodash";

export type TestExecutionResult = {
  node: TestFlowNode;
  response: AxiosResponse;
  assertionResult: AssertionResult;
}[];

export interface ITestFlowExecutor {
  execute(
    nodes: TestFlowNode[],
    edges?: TestFlowEdge[],
  ): Promise<TestExecutionResult>;
}

export class TestFlowExecutor {
  constructor(
    private readonly testFlowService: TestFlowService,
    private readonly executionStrategies: Record<string, ITestFlowExecutor>,
  ) {}

  async execute(ownerId: any, flowId: string) {
    const testFlow = await this.testFlowService.getById(ownerId, flowId);
    const nodes = await this.testFlowService.getNodesByFlowId(ownerId, flowId);
    const edges = await this.testFlowService.getEdgesByFlowId(ownerId, flowId);

    if (!testFlow) throw new Error("test flow not found");

    const executionStrategy = this.executionStrategies[testFlow.executionType];

    if (!executionStrategy) throw new Error("execution strategy not found");

    const flowRun = await this.testFlowService.createTestFlowRun(
      ownerId,
      flowId,
      {
        status: FlowRunStatus.running,
        startedAt: new Date(),
      },
    );

    const runResult = await executionStrategy.execute(nodes, edges);

    const isPassed = runResult.every(
      (result) => result.assertionResult.success,
    );

    await this.testFlowService.updateFlowRun(ownerId, flowId, {
      status: isPassed ? FlowRunStatus.success : FlowRunStatus.failed,
    });

    return flowRun;
  }
}
