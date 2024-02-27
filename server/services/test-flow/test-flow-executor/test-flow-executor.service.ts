import { useLog } from "../../../lib/log";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { FlowRunStatus } from "../../../model/entities/test-flow/TestFlowRun";
import { TestFlowService } from "../test-flow.service";
import { ExecutionResult } from "./sequence-executor";

const logger = useLog({ dirname: __dirname, filename: __filename });

export interface ITestFlowExecutor {
  execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
  ): Promise<ExecutionResult>;
}

export class TestFlowExecutor {
  constructor(
    private readonly testFlowService: TestFlowService,
    private executionStrategies: Record<string, ITestFlowExecutor>,
  ) {}

  async setExecutionStrategies(
    executionStrategies: Record<string, ITestFlowExecutor>,
  ) {
    this.executionStrategies = executionStrategies;
  }

  async execute(
    ownerId: any,
    flowId: string,
  ): Promise<ExecutionResult & { flowRunId: string }> {
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
        edges,
      },
    );

    const result: ExecutionResult & { flowRunId: string } = {
      success: false,
      context: {},
      flowRunId: flowRun.id,
    };

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

      const isPassed = runResult.success;

      await this.testFlowService.updateFlowRun(ownerId, flowRun.id, {
        finishedAt: new Date(),
        status: isPassed ? FlowRunStatus.success : FlowRunStatus.failed,
      });

      result.success = isPassed;
      result.context = runResult.context;
    } catch (e) {
      logger.error(e);
      await this.testFlowService.updateFlowRun(ownerId, flowRun.id, {
        finishedAt: new Date(),
        status: FlowRunStatus.error,
      });
    }

    return result;
  }

  getFlowRuns(ownerId: any, flowId: string, isSorted: boolean) {
    return this.testFlowService.getFlowRuns(ownerId, flowId, isSorted);
  }

  getFlowRun(ownerId: any, flowId: string, runId: string) {
    return this.testFlowService.getFlowRun(ownerId, flowId, runId);
  }
}
