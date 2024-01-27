import { TestFlow } from "../../../model/entities/test-flow/TestFlow";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { RequestService } from "../../request/request.service";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";

export class SequenceExecutor implements ITestFlowExecutor {
  constructor(private readonly requestService: RequestService) {}

  async execute(
    testFlow: TestFlow,
    nodes: TestFlowNode[],
    edges: TestFlowEdge[],
  ) {
    const sortedNodes = this.sortNodesByEdges(nodes, edges);

    for (let i = 0; i < nodes.length; i++) {
      const node = sortedNodes[i];
      try {
        const { method, url, headers, body, subdomain } = node;
        await this.requestService.execute({
          method,
          url: url ?? "/",
          headers: headers || {},
          body,
          subdomain,
        });
      } catch (e) {
        throw new Error(`Failed to execute step: ${node.id}`);
      }
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
