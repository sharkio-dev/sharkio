import { DataSource, FindManyOptions, Repository } from "typeorm";
import { CreateTestFlowDTO } from "../../../dto/in/test-flow.dto";
import { TestFlow } from "../../entities/test-flow/TestFlow";
import { TestFlowEdge } from "../../entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../entities/test-flow/TestFlowNodeRun";
import { TestFlowRun } from "../../entities/test-flow/TestFlowRun";
import { AssertionResult } from "../../../services/test-flow/test-flow-executor/node-response-validator";

export class TestFlowRepository {
  repository: Repository<TestFlow>;
  nodeRepository: Repository<TestFlowNode>;
  nodeRunRepository: Repository<TestFlowNodeRun>;
  edgeRepository: Repository<TestFlowEdge>;
  flowRunRepository: Repository<TestFlowRun>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(TestFlow);
    this.nodeRepository = appDataSource.manager.getRepository(TestFlowNode);
    this.nodeRunRepository =
      appDataSource.manager.getRepository(TestFlowNodeRun);
    this.edgeRepository = appDataSource.manager.getRepository(TestFlowEdge);
    this.flowRunRepository = appDataSource.manager.getRepository(TestFlowRun);
    this.nodeRunRepository =
      appDataSource.manager.getRepository(TestFlowNodeRun);
  }

  create(testFlow: CreateTestFlowDTO) {
    const newTestFlow = this.repository.create({ ...testFlow });
    return this.repository.save(newTestFlow);
  }

  deleteById(ownerId: string, flowId: string) {
    return this.repository.delete({ ownerId, id: flowId });
  }

  getByOwnerId(ownerId: string, type?: string) {
    return this.repository.find({ where: { ownerId, type } });
  }

  getById(ownerId: any, flowId: string) {
    return this.repository.findOne({ where: { ownerId, id: flowId } });
  }

  updateById(ownerId: any, flowId: string, testFlow: Partial<TestFlow>) {
    return this.repository.update(flowId, testFlow);
  }

  createTestNode(
    ownerId: string,
    flowId: string,
    testNode: Partial<TestFlowNode>,
  ) {
    const createdNode = this.nodeRepository.create({
      ...testNode,
      ownerId,
      flowId,
    });

    return this.nodeRepository.save(createdNode);
  }

  updateTestNode(
    ownerId: any,
    flowId: string,
    nodeId: string,
    testFlowNode: Partial<TestFlowNode>,
  ) {
    return this.nodeRepository.update(
      { ownerId, flowId, id: nodeId },
      testFlowNode,
    );
  }

  getNodesByFlowId(ownerId: any, flowId: string) {
    return this.nodeRepository.find({ where: { ownerId, flowId } });
  }

  getEdgesByFlowId(ownerId: any, flowId: string) {
    return this.edgeRepository.find({ where: { ownerId, flowId } });
  }

  deleteEdgesByFlowId(ownerId: any, flowId: string) {
    return this.edgeRepository.delete({ ownerId, flowId });
  }

  saveEdges(edges: Partial<TestFlowEdge>[]) {
    return this.edgeRepository.save(edges);
  }

  createFlowRun(
    ownerId: string,
    flowId: string,
    flowRun?: Partial<TestFlowRun>,
  ) {
    const newFlowRun = this.flowRunRepository.create({
      ownerId,
      flowId,
      ...flowRun,
    });

    return this.flowRunRepository.save(newFlowRun);
  }

  updateTestFlowRun(
    ownerId: string,
    flowRunId: string,
    testFlowRun: Partial<TestFlowRun>,
  ) {
    return this.flowRunRepository.update(
      { id: flowRunId, ownerId: ownerId },
      testFlowRun,
    );
  }

  addNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    node: TestFlowNode,
    nodeRun: Partial<TestFlowNodeRun>,
  ) {
    const { id, ...rest } = node;
    const createdNodeRun = this.nodeRunRepository.create({
      ...rest,
      ...nodeRun,
      ownerId,
      flowId,
      flowRunId,
      nodeId: node.id,
    });

    return this.nodeRunRepository.save(createdNodeRun);
  }

  async updateNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodeRunId: string,
    nodeRunResult: AssertionResult,
    nodeRun: Partial<TestFlowNodeRun>,
  ) {
    const updatedNodeRun = await this.nodeRunRepository.update(
      {
        id: nodeRunId,
        flowId,
        ownerId,
        flowRunId,
      },
      {
        ...nodeRun,
        assertionsResult: nodeRunResult,
      },
    );

    return updatedNodeRun;
  }

  addNodeRuns(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
  ) {
    const createdNodeRuns = nodes.map((node) => {
      const { id, ...rest } = node;
      return this.nodeRunRepository.create({
        ...rest,
        ownerId,
        flowId,
        flowRunId,
        nodeId: node.id,
        status: "pending",
      });
    });

    return this.nodeRunRepository.save(createdNodeRuns);
  }

  getFlowRuns(ownerId: any, flowId: string, isSorted: boolean) {
    const searchOptions: FindManyOptions<TestFlowRun> = isSorted
      ? {
          where: { ownerId, flowId },
          order: {
            createdAt: "DESC",
          },
        }
      : { where: { ownerId, flowId } };

    return this.flowRunRepository.find(searchOptions);
  }

  getFlowRun(ownerId: any, flowId: string, runId: string) {
    return this.flowRunRepository.find({
      where: { ownerId, flowId, id: runId },
    });
  }

  getFlowRunNodes(ownerId: any, flowId: string, runId: string) {
    return this.nodeRunRepository.find({
      where: { ownerId, flowId, flowRunId: runId },
    });
  }

  getFlowNode(ownerId: any, flowId: string, nodeId: string) {
    return this.nodeRepository.findOne({
      where: { ownerId, flowId, id: nodeId },
    });
  }

  deleteFlowNode(ownerId: any, flowId: string, nodeId: string) {
    return this.nodeRepository.delete({ ownerId, flowId, id: nodeId });
  }
}
