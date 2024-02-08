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
  AssertionResult,
  NodeResponseValidator,
} from "./node-response-validator";
import {
  ITestFlowExecutor,
  TestFlowExecutor,
} from "./test-flow-executor.service";

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
    private readonly requestService: RequestService,
    private readonly nodeResponseValidator: NodeResponseValidator,
    private readonly testFlowReporter: TestFlowReporter,
    private readonly testFlowService: TestFlowService,
    private readonly requestTransformer: RequestTransformer,
    private readonly testFlowExecutorService: TestFlowExecutor,
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
        const { subdomain } = nodeRun;

        if (subdomain == null) {
          throw new Error("subdomain is empty for http node");
        }

        if (nodeRun.type === "http") {
          const {
            method,
            url,
            headers: reqHeaders,
            body: reqBody,
          } = this.requestTransformer.transformRequest(nodeRun, result.context);

          const response = await this.requestService.execute({
            method,
            url: url ?? "/",
            headers: reqHeaders || {},
            body: reqBody,
            subdomain,
          });

          const { data: body, headers, status } = response;
          const assertionResponse = { body, headers, status };

          const assertionResult = await this.nodeResponseValidator.assert(
            nodeRun,
            assertionResponse,
            result.context,
          );

          await this.testFlowReporter.reportNodeRun(
            ownerId,
            flowId,
            flowRunId,
            nodeRun,
            assertionResult,
            {
              headers: response?.headers,
              body:
                typeof response?.data === "string"
                  ? response?.data
                  : JSON.stringify(response?.data ?? "", null, 2),
              status: response?.status,
            },
          );

          const resultItem = {
            node: nodeRun,
            response: assertionResponse,
            assertionResult,
            success: assertionResult.success,
          };

          result.context[nodeRun.nodeId] = resultItem;

          if (!assertionResult.success) {
            result.success = false;
            break;
          }
        } else if (nodeRun.type === "subflow") {
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
            result.context,
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

          result.context[nodeRun.nodeId] = execRes;

          if (!assertionResult.success) {
            result.success = false;
            break;
          }
        }
      }

      return result;
    } catch (e) {
      logger.error(e);
      throw new Error("Failed to run test flow");
    }
  }
}
