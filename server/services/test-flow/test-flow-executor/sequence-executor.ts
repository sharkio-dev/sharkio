import { useLog } from "../../../lib/log";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { INodeExecutor } from "../flow-node-executors/executors.types";
import { TestFlowService } from "../test-flow.service";
import { AssertionResponse } from "./node-response-validator";
import { ITestFlowExecutor } from "./test-flow-executor.service";

const logger = useLog({ dirname: __dirname, filename: __filename });

export type NodeRunResult = HttpNodeRunResult | FlowNodeRunResult;

export type HttpNodeRunResult = {
  node: TestFlowNode;
  response: AssertionResponse;
  success: boolean;
};

export type FlowNodeRunResult = {
  success: boolean;
  context: ExecutionContext;
};

export type ExecutionResult = {
  context: ExecutionContext;
  success: boolean;
};

export type ExecutionContext = Record<string, NodeRunResult>;

export class SequenceExecutor implements ITestFlowExecutor {
  constructor(
    private readonly testFlowService: TestFlowService,
    private readonly nodeExecutionStrategies: Record<string, INodeExecutor>,
  ) {}

  async execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
  ): Promise<ExecutionResult> {
    const sortedNodes = this.testFlowService.sortNodesByEdges(
      nodeRuns,
      edges,
    ) as TestFlowNodeRun[];

    const result: ExecutionResult = {
      context: {},
      success: true,
    };

    try {
      for (let i = 0; i < sortedNodes.length; i++) {
        const nodeRun = sortedNodes[i];

        const res = await this.nodeExecutionStrategies[nodeRun.type].execute(
          ownerId,
          flowId,
          flowRunId,
          nodes,
          nodeRuns,
          edges,
          nodeRun,
          result.context,
        );

        result.context[nodeRun.nodeId] = res;

        if (!res.success) {
          result.success = false;
          break;
        }
      }
    } catch (e) {
      result.success = false;
      logger.error(e);
      throw new Error("Failed to run test flow");
    }

    return result;
  }
}
