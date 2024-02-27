import { useLog } from "../../../lib/log";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { INodeExecutor } from "../flow-node-executors/executors.types";
import { TestFlowService } from "../test-flow.service";
import { ExecutionResult } from "./sequence-executor";
import { ITestFlowExecutor } from "./test-flow-executor.service";

const logger = useLog({ dirname: __dirname, filename: __filename });

export class ParallelExecutor implements ITestFlowExecutor {
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
  ) {
    const result: ExecutionResult = {
      context: {},
      success: true,
    };

    const res = await Promise.all(
      nodeRuns.map(async (nodeRun) => {
        try {
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
          }
        } catch (e) {
          result.success = false;
        }
      }),
    );

    return result;
  }
}
