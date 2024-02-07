import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { RequestService } from "../../request/request.service";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { NodeResponseValidator } from "./node-response-validator";
import { ITestFlowExecutor } from "./test-flow-executor.service";

export class ParallelExecutor implements ITestFlowExecutor {
  constructor(
    private readonly requestService: RequestService,
    private readonly nodeResponseValidator: NodeResponseValidator,
    private readonly testFlowReporter: TestFlowReporter,
  ) {}

  async execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
  ) {
    const res = await Promise.all(
      nodeRuns.map(async (nodeRun) => {
        try {
          const {
            method,
            url,
            headers: reqHeaders,
            body: reqBody,
            subdomain,
          } = nodeRun;

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
            {},
          );

          await this.testFlowReporter.reportNodeRun(
            ownerId,
            flowId,
            flowRunId,
            nodeRun,
            assertionResult,
            assertionResponse,
          );

          const resultItem = {
            node: nodeRun,
            response: assertionResponse,
            assertionResult,
          };

          return resultItem;
        } catch (e) {
          throw new Error("Failed to execute test flow node");
        }
      }),
    );
    return res;
  }
}
