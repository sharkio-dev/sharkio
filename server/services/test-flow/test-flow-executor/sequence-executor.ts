import { AxiosResponse } from "axios";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { RequestService } from "../../request/request.service";
import {
  AssertionResponse,
  AssertionResult,
  NodeResponseValidator,
} from "./node-response-validator";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { useLog } from "../../../lib/log";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { TestFlowService } from "../test-flow.service";
import { RequestTransformer } from "../../request-transformer/request-transformer";

const logger = useLog({ dirname: __dirname, filename: __filename });

export type NodeRunResult = {
  node: TestFlowNode;
  response: AssertionResponse;
  assertionResult: AssertionResult;
};

export type ExecutionResult = NodeRunResult[];

export type ExecutionContext = Record<string, NodeRunResult>;

export class SequenceExecutor implements ITestFlowExecutor {
  constructor(
    private readonly requestService: RequestService,
    private readonly nodeResponseValidator: NodeResponseValidator,
    private readonly testFlowReporter: TestFlowReporter,
    private readonly testFlowService: TestFlowService,
    private readonly requestTransformer: RequestTransformer,
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

    try {
      const result: ExecutionResult = [];
      const context: ExecutionContext = {};

      for (let i = 0; i < sortedNodes.length; i++) {
        const nodeRun = sortedNodes[i];
        const { subdomain } = nodeRun;

        const {
          method,
          url,
          headers: reqHeaders,
          body: reqBody,
        } = this.requestTransformer.transformRequest(nodeRun, context);

        const response = await this.requestService.execute({
          method,
          url: url ?? "/",
          headers: reqHeaders || {},
          body: reqBody,
          subdomain,
        });

        const { data: body, headers, status, ...rest } = response;
        const assertionResponse = { body, headers, status };

        const assertionResult = await this.nodeResponseValidator.assert(
          nodeRun,
          assertionResponse,
          context,
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
        };

        context[nodeRun.nodeId] = resultItem;

        result.push(resultItem);

        if (!assertionResult.success) {
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
