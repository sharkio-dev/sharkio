import { TestFlow } from "../../../model/entities/test-flow/TestFlow";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowService } from "../test-flow.service";

export interface ITestFlowExecutor {
  execute(
    testFlow: TestFlow,
    nodes: TestFlowNode[],
    edges?: TestFlowEdge[],
  ): Promise<void>;
}

export class TestFlowExecutor {
  constructor(
    private readonly testFlowService: TestFlowService,
    private readonly executionStrategies: Record<string, ITestFlowExecutor>,
  ) {}

  async execute(ownerId: any, flowId: string) {
    const testFlow = await this.testFlowService.getById(ownerId, flowId);
    const nodes = await this.testFlowService.getNodesByFlowId(ownerId, flowId);
    const edges = await this.testFlowService.getEdgesByFlowId(ownerId, flowId);

    if (!testFlow) throw new Error("test flow not found");

    const executionStrategy = this.executionStrategies[testFlow.executionType];

    if (!executionStrategy) throw new Error("execution strategy not found");

    return executionStrategy.execute(testFlow, nodes, edges);
  }
}
