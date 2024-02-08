import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { RequestTransformer } from "../../request-transformer/request-transformer";
import { RequestService } from "../../request/request.service";
import { NodeResponseValidator } from "../test-flow-executor/node-response-validator";
import { ExecutionResult } from "../test-flow-executor/sequence-executor";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { INodeExecutor } from "./executors.types";

export class HttpNodeExecutor implements INodeExecutor {
  constructor(
    private readonly requestService: RequestService,
    private readonly nodeResponseValidator: NodeResponseValidator,
    private readonly testFlowReporter: TestFlowReporter,
    private readonly requestTransformer: RequestTransformer,
  ) {}

  async execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
    nodeRun: TestFlowNodeRun,
    result: ExecutionResult,
  ) {
    const { subdomain } = nodeRun;

    if (subdomain == null) {
      throw new Error("subdomain is empty for http node");
    }

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
    return result;
  }
}
