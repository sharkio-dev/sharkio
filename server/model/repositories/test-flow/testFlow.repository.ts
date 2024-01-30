import { DataSource, Repository } from "typeorm";
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

  getByOwnerId(ownerId: string) {
    return this.repository.find({ where: { ownerId } });
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

  getNodesByFlowId(ownerId: any, flowId: string) {
    return this.nodeRepository.find({ where: { ownerId, flowId } });
  }

  getEdgesByFlowId(ownerId: any, flowId: string) {
    return this.edgeRepository.find({ where: { ownerId, flowId } });
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
    return this.flowRunRepository.update(flowRunId, testFlowRun);
  }

  async addNodeRun(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    node: TestFlowNode,
    nodeRun: Partial<TestFlowNodeRun>,
  ) {
    const createdNodeRun = this.nodeRunRepository.create({
      ownerId,
      flowId,
      flowRunId,
      nodeId: node.id,
      ...nodeRun,
      ...node,
    });

    return await this.nodeRunRepository.save(createdNodeRun);
  }
}
