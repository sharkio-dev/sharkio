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
    private readonly snifferRepository: SnifferRepository,
  ) {}

  createFlow(createFlowDTO: CreateTestFlowDTO) {
    return this.repository.create(createFlowDTO);
  }

  getByOwnerId(ownerId: string) {
    return this.repository.getByOwnerId(ownerId);
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
    testFlowNode: Partial<TestFlowNode>,
  ) {
    return this.repository.createTestNode(ownerId, flowId, testFlowNode);
  }

  updateNode(
    ownerId: any,
    flowId: string,
    nodeId: string,
    testFlowNode: Partial<TestFlowNode>,
  ) {
    return this.repository.updateTestNode(
      ownerId,
      flowId,
      nodeId,
      testFlowNode,
    );
  }

  getNodesByFlowId(ownerId: any, flowId: string) {
    return this.repository.getNodesByFlowId(ownerId, flowId);
  }

  getEdgesByFlowId(ownerId: any, flowId: string) {
    return this.repository.getEdgesByFlowId(ownerId, flowId);
  }

  createTestFlowRun(
    ownerId: string,
    flowId: string,
    testFlowRun: Partial<TestFlowRun>,
  ) {
    return this.repository.createFlowRun(ownerId, flowId, testFlowRun);
  }

  async createNodeRuns(
    ownerId: string,
    flowId: string,
    testFlowRun: TestFlowRun,
    nodes: TestFlowNode[],
  ) {
    const proxyIds = new Set<string>();
    nodes.forEach((node) => {
      proxyIds.add(node.proxyId);
    });

    const proxies = await this.snifferRepository.getByIds(Array.from(proxyIds));

    const nodesWithSubdomains = nodes.map((node) => {
      const proxy = proxies.find((proxy) => proxy.id === node.proxyId);

      if (!proxy) {
        throw new Error("Failed to create node runs. Proxy not found");
      }

      return {
        ...node,
        subdomain: proxy.subdomain,
      };
    });

    return this.repository.addNodeRuns(
      ownerId,
      flowId,
      testFlowRun.id,
      nodesWithSubdomains,
    );
  }

  updateNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodeRunId: string,
    nodeRunResult: AssertionResult,
    nodeRun: Partial<TestFlowNodeRun>,
  ) {
    return this.repository.updateNodeRun(
      ownerId,
      flowId,
      flowRunId,
      nodeRunId,
      nodeRunResult,
      nodeRun,
    );
  }

  updateFlowRun(
    ownerId: string,
    flowRunId: string,
    testFlowRun: Partial<TestFlowRun>,
  ) {
    return this.repository.updateTestFlowRun(ownerId, flowRunId, testFlowRun);
  }

  addNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    node: TestFlowNode,
    nodeRunResult: AssertionResult,
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

  getFlowRunNodes(ownerId: any, flowId: string, runId: string) {
    return this.repository.getFlowRunNodes(ownerId, flowId, runId);
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
}
