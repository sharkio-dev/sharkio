import { TestFlowEdgeRepository } from "../../model/test-suite/test-flow/test-flow-edge.model";
import {
  TestFlowNode,
  TestFlowNodeRepository,
} from "../../model/test-suite/test-flow/test-flow-node.model";
import { TestFlowRepository } from "../../model/test-suite/test-flow/test-flow.model";

export class TestFlowService {
  constructor(
    private readonly testFlowNodeRepository: TestFlowNodeRepository,
    private readonly testFlowEdgeRepository: TestFlowEdgeRepository,
    private readonly testFlowRepository: TestFlowRepository,
  ) {}

  async createFlow() {}
  async addNode(flowId: string) {}
  async executeFlow(flowId: string) {}
  async executeNode(node: TestFlowNode) {}

  async test() {
    const testSuiteId = "afe3e7ca-ce03-4f0f-ab0f-6a97b0b7d0d8";
    // const testFlow = await this.testFlowRepository.create(testSuiteId);
    // const node = await this.testFlowNodeRepository.create({
    //   body: `{"hello":"world"}`,
    //   flowId: "b7f66c0d-e8bc-43c3-b288-3780faa864be",
    // });
    const edge = await this.testFlowEdgeRepository.create({
      flowId: "b7f66c0d-e8bc-43c3-b288-3780faa864be",
      sourceNodeId: "1963bddf-402a-4775-8cc7-99f4629907f5",
      targetNodeId: "1dbcbcdf-48c6-4d85-972d-827aad4a3d9e",
    });

    console.log("Finished test");
  }
}
