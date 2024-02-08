import { useLog } from "../../../lib/log";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { RequestTransformer } from "../../request-transformer/request-transformer";
import { RequestService } from "../../request/request.service";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { TestFlowService } from "../test-flow.service";
import {
  AssertionResponse,
  NodeResponseValidator,
} from "./node-response-validator";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { INodeExecutor } from "../flow-node-executors/executors.types";

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
          result,
        );

        if (!res.success) {
          result.success = false;
          break;
        }
      }

      return result;
    } catch (e) {
      logger.error(e);
      throw new Error("Failed to run test flow");
    }
  }
}
