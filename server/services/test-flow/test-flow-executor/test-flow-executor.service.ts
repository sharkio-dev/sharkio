import { AxiosResponse } from "axios";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import {
  FlowRunStatus,
  TestFlowRun,
} from "../../../model/entities/test-flow/TestFlowRun";
import { TestFlowService } from "../test-flow.service";
import { AssertionResult } from "./node-response-validator";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";

export type TestExecutionResult = {
  node: TestFlowNode;
  response: AxiosResponse;
  assertionResult: AssertionResult;
}[];

export interface ITestFlowExecutor {
  execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
  ): Promise<TestExecutionResult>;
}

export class TestFlowExecutor {
  constructor(
    private readonly testFlowService: TestFlowService,
    private readonly executionStrategies: Record<string, ITestFlowExecutor>,
  ) {}

  async execute(ownerId: any, flowId: string): Promise<TestFlowRun> {
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

    try {
      const nodeRuns: TestFlowNodeRun[] =
        await this.testFlowService.createNodeRuns(
          ownerId,
          flowId,
          flowRun,
          nodes,
        );

      const runResult = await executionStrategy.execute(
        ownerId,
        flowId,
        flowRun.id,
        nodes,
        nodeRuns,
        edges,
      );

      const isPassed = runResult.every(
        (result) => result.assertionResult.success,
      );

      await this.testFlowService.updateFlowRun(ownerId, flowRun.id, {
        finishedAt: new Date(),
        status: isPassed ? FlowRunStatus.success : FlowRunStatus.failed,
      });
    } catch (e) {
      await this.testFlowService.updateFlowRun(ownerId, flowRun.id, {
        finishedAt: new Date(),
        status: FlowRunStatus.error,
      });
    }

    return flowRun;
  }

  getFlowRuns(ownerId: any, flowId: string, isSorted: boolean) {
    return this.testFlowService.getFlowRuns(ownerId, flowId, isSorted);
  }

  getFlowRun(ownerId: any, flowId: string, runId: string) {
    return this.testFlowService.getFlowRun(ownerId, flowId, runId);
  }

  getFlowRunNodes(ownerId: any, flowId: string, runId: string) {
    return this.testFlowService.getFlowRunNodes(ownerId, flowId, runId);
  }
}
