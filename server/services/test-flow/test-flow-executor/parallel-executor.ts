import { AxiosResponse } from "axios";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { RequestService } from "../../request/request.service";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { NodeResponseValidator } from "./node-response-validator";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";

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
          const { method, url, headers, body, subdomain } = nodeRun;
          let response: AxiosResponse | Error;

          response = await this.requestService.execute({
            method,
            url: url ?? "/",
            headers: headers || {},
            body,
            subdomain,
          });
          const assertionResult = await this.nodeResponseValidator.assert(
            nodeRun,
            response,
          );

          await this.testFlowReporter.reportNodeRun(
            ownerId,
            flowId,
            flowRunId,
            nodeRun,
            assertionResult,
          );

          const resultItem = { node: nodeRun, response, assertionResult };
          return resultItem;
        } catch (e) {
          throw new Error("Failed to execute test flow node");
        }
      }),
    );
    return res;
  }
}
