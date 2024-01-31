import { AxiosResponse } from "axios";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { RequestService } from "../../request/request.service";
import {
  AssertionResult,
  NodeResponseValidator,
} from "./node-response-validator";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { useLog } from "../../../lib/log";

const logger = useLog({ dirname: __dirname, filename: __filename });

export type ExecutionResult = {
  node: TestFlowNode;
  response: AxiosResponse;
  assertionResult: AssertionResult;
}[];

export class SequenceExecutor implements ITestFlowExecutor {
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
    edges: TestFlowEdge[],
  ): Promise<ExecutionResult> {
    const sortedNodes = this.sortNodesByEdges(nodes, edges);

    try {
      const result: ExecutionResult = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = sortedNodes[i];

        const { method, url, headers, body, subdomain } = node;
        const response = await this.requestService.execute({
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
          node,
          assertionResult,
        );

        const resultItem = { node, response, assertionResult };

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

  sortNodesByEdges(
    nodes: TestFlowNode[],
    edges: TestFlowEdge[],
  ): TestFlowNode[] {
    // Create a map to count incoming edges for each node
    const incomingEdges: Map<string, number> = new Map(
      nodes.map((node) => [node.id, 0]),
    );

    // Count incoming edges
    edges.forEach((edge) => {
      incomingEdges.set(
        edge.targetId,
        (incomingEdges.get(edge.targetId) || 0) + 1,
      );
    });

    // Find the starting node(s) with no incoming edges
    const startNodes: string[] = Array.from(incomingEdges.entries())
      .filter(([nodeId, count]) => count === 0)
      .map(([nodeId, _]) => nodeId);

    // Perform topological sort
    let sorted: string[] = [];
    let toProcess: string[] = [...startNodes];

    while (toProcess.length) {
      const nodeId = toProcess.pop();
      if (nodeId) {
        sorted.push(nodeId);
        const outEdges = edges.filter((edge) => edge.sourceId === nodeId);

        // Find and process nodes that this node points to
        outEdges.forEach((edge) => {
          const targetId = edge.targetId;
          const incomingEdge = incomingEdges.get(targetId) ?? 0;
          const currentScore = incomingEdge - 1;
          incomingEdges.set(targetId, currentScore);

          // If no more incoming edges, add to processing list
          if (incomingEdges.get(targetId) === 0) {
            toProcess.push(targetId);
          }
        });
      }
    }
    const res = nodes.filter((node) => sorted.includes(node.id));

    // Return nodes in sorted order
    return res;
  }
}
