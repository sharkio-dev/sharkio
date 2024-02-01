import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";
import { get } from "lodash";

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
  isFlowLoading: boolean;
  loadFlows: () => void;
  loadNodes: () => void;
  loadTestRuns: () => void;
  loadNode: (flowId: string, id: string) => Promise<Node>;
  loadRun: (flowId: string, id: string) => Promise<TestRun>;
  deleteFlow: (flowId: string) => void;
  runFlow: (flowId: string) => void;
  postFlow: (flow: Flow) => void;
  putFlow: (flow: Flow) => void;
  postNode: (node: Node) => void;
  deleteNode: (nodeId: string) => void;
  putNode: (node: Node) => void;
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

const deleteFlow = (flowId: string) => {
  return BackendAxios.delete(`/flows/${flowId}`);
};

const runFlow = (flowId: string) => {
  return BackendAxios.post(`/flows/${flowId}/run`);
};

const postFlow = (flow: Flow) => {
  return BackendAxios.post(`/flows`, flow);
};

const putFlow = (flow: Flow) => {
  return BackendAxios.put(`/flows/${flow.id}`, flow);
};

const postNode = (node: Node) => {
  return BackendAxios.post(`/nodes`, node);
};

const deleteNode = (nodeId: string) => {
  return BackendAxios.delete(`/nodes/${nodeId}`);
};

const putNode = (node: Node) => {
  return BackendAxios.put(`/nodes/${node.id}`, node);
};

export const useFlowStore = create<flowState>((set, get) => ({
  flows: [],
  nodes: [],
  runs: [],
  isFlowsLoading: false,
  isNodesLoading: false,
  isRunsLoading: false,
  isRunLoading: false,
  isNodeLoading: false,
  isFlowLoading: false,
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
  deleteFlow: async (flowId: string) => {
    set({ isFlowLoading: true });
    await deleteFlow(flowId).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadFlows();
  },
  runFlow: async (flowId: string) => {
    set({ isFlowLoading: true });
    await runFlow(flowId).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadTestRuns();
  },
  postFlow: async (flow: Flow) => {
    set({ isFlowLoading: true });
    await postFlow(flow).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadFlows();
  },
  putFlow: async (flow: Flow) => {
    set({ isFlowLoading: true });
    await putFlow(flow).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadFlows();
  },
  postNode: async (node: Node) => {
    set({ isNodeLoading: true });
    await postNode(node).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes();
  },
  deleteNode: async (nodeId: string) => {
    set({ isNodeLoading: true });
    await deleteNode(nodeId).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes();
  },
  putNode: async (node: Node) => {
    set({ isNodeLoading: true });
    await putNode(node).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes();
  },
}));
