import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { NodeResponseValidator } from "../test-flow-executor/node-response-validator";
import {
  ExecutionContext,
  ExecutionResult,
} from "../test-flow-executor/sequence-executor";
import { TestFlowExecutor } from "../test-flow-executor/test-flow-executor.service";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { INodeExecutor } from "./executors.types";

export class SubflowNodeExecutor implements INodeExecutor {
  constructor(
    private readonly nodeResponseValidator: NodeResponseValidator,
    private readonly testFlowReporter: TestFlowReporter,
    private readonly testFlowExecutorService: TestFlowExecutor,
  ) {}

  async execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
    nodeRun: TestFlowNodeRun,
    context: ExecutionContext,
  ) {
    const currentResult: ExecutionResult = {
      context: {},
      success: true,
    };

    if (nodeRun.subFlowId == null) {
      throw new Error("subflowId is empty for subflow node");
    }
    if (nodeRun.subFlowId === flowId) {
      throw new Error("Flow cannot be a subflow of itself");
    }
    const execRes = await this.testFlowExecutorService.execute(
      ownerId,
      nodeRun.subFlowId,
    );

    const assertionResult = await this.nodeResponseValidator.assert(
      nodeRun,
      execRes,
      context,
    );

    await this.testFlowReporter.reportNodeRun(
      ownerId,
      flowId,
      flowRunId,
      nodeRun,
      assertionResult,
      {
        context: execRes.context,
        success: assertionResult.success,
      },
    );

    execRes.success = assertionResult.success;

    return execRes;
  }
}
