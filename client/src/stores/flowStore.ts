import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";

export interface Flow {
  id: string;
  name: string;
  executionType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const FLOW_NODE = {
  id: "d70692d2-5ab8-44ba-ad0e-3e9cb0ab91d4",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  flowId: "673bf1a6-8662-41a2-a1eb-6e7acba75629",
  proxyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "Test name",
  url: "/URL",
  body: "",
  subdomain: "ron-demo-9usub",
  snifferId: "8b5ea683-d68d-43fe-b18d-ab516540aac3",
  headers: {},
  assertions: [
    {
      path: "body.example",
      comparator: "eq",
      expectedValue: "example",
    },
  ],
  method: "GET",
  createdAt: "2024-01-26T14:22:52.255Z",
  updatedAt: "2024-01-26T14:22:52.255Z",
};

interface Assertion {
  path: string;
  comparator: string;
  expectedValue: string;
}

interface Node {
  id: string;
  ownerId: string;
  flowId: string;
  proxyId: string;
  name: string;
  url: string;
  body: string;
  subdomain: string;
  snifferId: string;
  headers: {};
  assertions: Assertion[];
  method: string;
  createdAt: string;
  updatedAt: string;
}

interface TestRun {
  id: string;
  status: string;
  flowId: string;
  createdAt: string;
}

interface flowState {
  flows: Flow[];
  nodes: Node[];
  runs: TestRun[];
  isFlowsLoading: boolean;
  isNodesLoading: boolean;
  isRunsLoading: boolean;
  isRunLoading: boolean;
  isNodeLoading: boolean;
  loadFlows: () => void;
  loadNodes: () => void;
  loadTestRuns: () => void;
  loadNode: (flowId: string, id: string) => Promise<Node>;
  loadRun: (flowId: string, id: string) => Promise<TestRun>;
}

const getFlows = () => {
  return BackendAxios.get("/flows");
};

const getNodes = () => {
  return BackendAxios.get("/nodes");
};

const getTestRuns = () => {
  return BackendAxios.get("/test-runs");
};

const getNode = (flowId: string, nodeId: string) => {
  return BackendAxios.get(`/nodes/id`);
};

const getRun = (flowId: string, runId: string) => {
  return BackendAxios.get(`/test-runs/id`);
};

export const useFlowStore = create<flowState>((set) => ({
  flows: [],
  nodes: [],
  runs: [],
  isFlowsLoading: false,
  isNodesLoading: false,
  isRunsLoading: false,
  isRunLoading: false,
  isNodeLoading: false,
  loadFlows: async () => {
    set({ isFlowsLoading: true });
    const { data } = await getFlows().finally(() => {
      set({ isFlowsLoading: false });
    });
    set({ flows: data || [] });
  },
  loadNodes: async () => {
    set({ isNodesLoading: true });
    const { data } = await getNodes().finally(() => {
      set({ isNodesLoading: false });
    });
    set({ nodes: data || [] });
  },
  loadTestRuns: async () => {
    set({ isRunsLoading: true });
    const { data } = await getTestRuns().finally(() => {
      set({ isRunsLoading: false });
    });
    set({ runs: data || [] });
  },
  loadNode: async (flowId: string, nodeId: string) => {
    set({ isNodeLoading: true });
    const { data } = await getNode(flowId, nodeId).finally(() => {
      set({ isNodeLoading: false });
    });
    return data;
  },
  loadRun: async (flowId: string, runId: string) => {
    set({ isRunLoading: true });
    const { data } = await getRun(flowId, runId).finally(() => {
      set({ isRunLoading: false });
    });
    return data;
  },
}));
