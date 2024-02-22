import { CreateTestFlowDTO } from "../../dto/in/test-flow.dto";
import { TestFlow } from "../../model/entities/test-flow/TestFlow";
import { TestFlowEdge } from "../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../model/entities/test-flow/TestFlowNodeRun";
import { TestFlowRun } from "../../model/entities/test-flow/TestFlowRun";
import { SnifferRepository } from "../../model/repositories/sniffers.repository";
import { TestFlowRepository } from "../../model/repositories/test-flow/testFlow.repository";
import { AssertionResult } from "./test-flow-executor/node-response-validator";

export class TestFlowService {
  constructor(
    private readonly repository: TestFlowRepository,
    private readonly snifferRepository: SnifferRepository
  ) {}

  createFlow(createFlowDTO: CreateTestFlowDTO) {
    createFlowDTO.executionType =
      createFlowDTO.type === "suite" ? "parallel" : "sequence";

    return this.repository.create(createFlowDTO);
  }

  getByOwnerId(ownerId: string, type?: string) {
    return this.repository.getByOwnerId(ownerId, type);
  }

  getById(ownerId: any, flowId: string) {
    return this.repository.getById(ownerId, flowId);
  }

  updateById(ownerId: any, flowId: any, testFlow: Partial<TestFlow>) {
    return this.repository.updateById(ownerId, flowId, testFlow);
  }

  deleteById(ownerId: any, flowId: string) {
    return this.repository.deleteById(ownerId, flowId);
  }

  createNode(
    ownerId: string,
    flowId: string,
    testFlowNode: Partial<TestFlowNode>
  ) {
    if (testFlowNode.type === "subflow") {
      const successAssertion = testFlowNode.assertions?.find((assertion) => {
        assertion.path === "success";
      });

      if (successAssertion == null) {
        testFlowNode.assertions?.push({
          comparator: "eq",
          expectedValue: true,
          type: "boolean",
          path: "success",
          useTemplateEngine: false,
        });
      }
    }
    return this.repository.createTestNode(ownerId, flowId, testFlowNode);
  }

  updateNode(
    ownerId: any,
    flowId: string,
    nodeId: string,
    testFlowNode: Partial<TestFlowNode>
  ) {
    return this.repository.updateTestNode(
      ownerId,
      flowId,
      nodeId,
      testFlowNode
    );
  }

  async getNodesByFlowId(ownerId: any, flowId: string, isSorted = false) {
    const nodes = await this.repository.getNodesByFlowId(ownerId, flowId);

    if (!isSorted) {
      return nodes;
    }

    const edges = await this.repository.getEdgesByFlowId(ownerId, flowId);
    const sorted = this.sortNodesByEdges(nodes, edges);

    return sorted;
  }

  getEdgesByFlowId(ownerId: any, flowId: string) {
    return this.repository.getEdgesByFlowId(ownerId, flowId);
  }

  createTestFlowRun(
    ownerId: string,
    flowId: string,
    testFlowRun: Partial<TestFlowRun>
  ) {
    return this.repository.createFlowRun(ownerId, flowId, testFlowRun);
  }

  async createNodeRuns(
    ownerId: string,
    flowId: string,
    testFlowRun: TestFlowRun,
    nodes: TestFlowNode[]
  ) {
    const proxyIds = new Set<string>();
    nodes.forEach((node) => {
      node.proxyId != null && proxyIds.add(node.proxyId);
    });

    const proxies = await this.snifferRepository.getByIds(Array.from(proxyIds));

    const nodesWithSubdomains = nodes.map((node) => {
      const proxy = proxies.find((proxy) => proxy.id === node.proxyId);

      return {
        ...node,
        subdomain: proxy?.subdomain ?? null,
      };
    });

    return this.repository.addNodeRuns(
      ownerId,
      flowId,
      testFlowRun.id,
      nodesWithSubdomains
    );
  }

  updateNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodeRunId: string,
    nodeRunResult: AssertionResult,
    nodeRun: Partial<TestFlowNodeRun>
  ) {
    return this.repository.updateNodeRun(
      ownerId,
      flowId,
      flowRunId,
      nodeRunId,
      nodeRunResult,
      nodeRun
    );
  }

  updateFlowRun(
    ownerId: string,
    flowRunId: string,
    testFlowRun: Partial<TestFlowRun>
  ) {
    return this.repository.updateTestFlowRun(ownerId, flowRunId, testFlowRun);
  }

  addNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    node: TestFlowNode,
    nodeRunResult: AssertionResult
  ) {
    return this.repository.addNodeRun(ownerId, flowId, flowRunId, node, {
      assertionsResult: nodeRunResult,
      status: nodeRunResult.success ? "success" : "failed",
    });
  }

  getFlowRuns(ownerId: any, flowId: string, isSorted: boolean) {
    return this.repository.getFlowRuns(ownerId, flowId, isSorted);
  }

  getFlowRun(ownerId: any, flowId: string, runId: string) {
    return this.repository.getFlowRun(ownerId, flowId, runId);
  }

  async getFlowRunNodes(
    ownerId: any,
    flowId: string,
    runId: string,
    isSorted = false
  ) {
    const nodes = await this.repository.getFlowRunNodes(ownerId, flowId, runId);
    if (!isSorted) {
      return nodes;
    }

    const edges = await this.repository.getEdgesByFlowId(ownerId, flowId);
    const sorted = this.sortNodesByEdges(nodes, edges);

    return sorted;
  }

  getFlowRunNode(ownerId: any, flowId: string, nodeId: string) {
    return this.repository.getFlowNode(ownerId, flowId, nodeId);
  }

  deleteFlowNode(ownerId: any, flowId: string, nodeId: string) {
    return this.repository.deleteFlowNode(ownerId, flowId, nodeId);
  }

  async reorderNodes(ownerId: any, flowId: string, nodeIds: string[]) {
    await this.repository.deleteEdgesByFlowId(ownerId, flowId);
    const edges: Partial<TestFlowEdge>[] = [];
    for (let i = 0; i < nodeIds.length - 1; i++) {
      const newEdge: Partial<TestFlowEdge> = {
        flowId,
        ownerId,
        sourceId: nodeIds[i],
        targetId: nodeIds[i + 1],
      };
      edges.push(newEdge);
    }

    return this.repository.saveEdges(edges);
  }

  sortNodesByEdges(
    nodes: TestFlowNodeRun[] | TestFlowNode[],
    edges: TestFlowEdge[]
  ): TestFlowNodeRun[] | TestFlowNode[] {
    // Create a map to count incoming edges for each node
    const incomingEdges: Map<string, number> = new Map(
      nodes.map((node: TestFlowNodeRun | TestFlowNode) => {
        let id = node instanceof TestFlowNode ? node.id : node.nodeId;

        return [id, 0];
      })
    );

    // Count incoming edges
    edges.forEach((edge) => {
      incomingEdges.set(
        edge.targetId,
        (incomingEdges.get(edge.targetId) || 0) + 1
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
    // const res = nodes.filter((node: TestFlowNodeRun | TestFlowNode) =>
    //   sorted.includes(node instanceof TestFlowNode ? node.id : node.nodeId),
    // );

    const res = sorted.map((id) =>
      nodes.find((node: TestFlowNodeRun | TestFlowNode) => {
        const calculatedId =
          node instanceof TestFlowNode ? node.id : node.nodeId;

        return calculatedId === id;
      })
    ) as (TestFlowNodeRun | TestFlowNode)[];

    // Return nodes in sorted order
    return res;
  }
}
