import { DataSource, Repository } from "typeorm";
import { TestFlow } from "../../entities/test-flow/TestFlow";
import {
  CreateTestFlowDTO,
  CreateTestNodeDTO,
} from "../../../dto/in/test-flow.dto";
import { TestFlowNode } from "../../entities/test-flow/TestFlowNode";
import { TestFlowEdge } from "../../entities/test-flow/TestFlowEdge";

export class TestFlowRepository {
  repository: Repository<TestFlow>;
  nodeRepository: Repository<TestFlowNode>;
  edgeRepository: Repository<TestFlowEdge>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(TestFlow);
    this.nodeRepository = appDataSource.manager.getRepository(TestFlowNode);
    this.edgeRepository = appDataSource.manager.getRepository(TestFlowEdge);
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
}
