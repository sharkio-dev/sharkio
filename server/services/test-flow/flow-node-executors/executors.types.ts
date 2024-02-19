import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import {
  ExecutionContext,
  ExecutionResult,
  NodeRunResult,
} from "../test-flow-executor/sequence-executor";

export type INodeExecutor = {
  execute: (
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
    nodeRun: TestFlowNodeRun,
    result: ExecutionContext,
  ) => Promise<NodeRunResult>;
};
