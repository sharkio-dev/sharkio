import { TestFlow } from "../../../model/entities/test-flow/TestFlow";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { RequestService } from "../../request/request.service";

export class ParallelExecutor implements ITestFlowExecutor {
  constructor(private readonly requestService: RequestService) {}

  async execute(testFlow: TestFlow, nodes: TestFlowNode[]) {
    const res = await Promise.all(
      nodes.map(async (node) => {
        const { method, url, headers, body, subdomain } = node;
        return this.requestService.execute({
          method,
          url: url ?? "/",
          headers: headers || {},
          body,
          subdomain,
        });
      }),
    ).catch((e) => {
      throw new Error("Failed to execute test flow");
    });
  }
}
