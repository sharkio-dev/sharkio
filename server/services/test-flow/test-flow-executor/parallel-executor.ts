import { AxiosResponse } from "axios";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { RequestService } from "../../request/request.service";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { NodeResponseValidator } from "./node-response-validator";
import { TestFlowReporter } from "../test-flow-reporter.service";

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
  ) {
    const res = await Promise.all(
      nodes.map(async (node) => {
        try {
          const { method, url, headers, body, subdomain } = node;
          let response: AxiosResponse | Error;

          response = await this.requestService.execute({
            method,
            url: url ?? "/",
            headers: headers || {},
            body,
            subdomain,
          });
          const assertionResult = await this.nodeResponseValidator.assert(
            node,
            response,
          );

          await this.testFlowReporter.reportNodeRun(
            ownerId,
            flowId,
            flowRunId,
            assertionResult,
          );

          const resultItem = { node, response, assertionResult };
          return resultItem;
        } catch (e) {
          throw new Error("Failed to execute test flow node");
        }
      }),
    );
    return res;
  }
}
