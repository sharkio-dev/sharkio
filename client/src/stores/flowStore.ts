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
  loadNodes: (flowId: string) => void;
  loadTestRuns: () => void;
  loadNode: (flowId: string, id: string) => Promise<Node>;
  loadRun: (flowId: string, id: string) => Promise<TestRun>;
  deleteFlow: (flowId: string) => void;
  runFlow: (flowId: string) => void;
  postFlow: (flow: Flow["name"]) => void;
  putFlow: (flow: Flow) => void;
  postNode: (flowId: string, node: Node) => void;
  deleteNode: (flowId: string, nodeId: string) => void;
  putNode: (flowId: string, node: Node) => void;
}

const getFlows = () => {
  return BackendAxios.get("/test-flows");
};

const getNodes = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes`);
};

const getTestRuns = () => {
  return BackendAxios.get(
    "/test-flows/673bf1a6-8662-41a2-a1eb-6e7acba75629/runs",
  );
};

const getNode = (flowId: string, nodeId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes/${nodeId}`);
};

const getRun = (flowId: string, runId: string) => {
  return BackendAxios.get(
    `/test-flows/673bf1a6-8662-41a2-a1eb-6e7acba75629/runs/eefae5f8-367e-4361-9204-1764be5a4b92/node-runs`,
  );
};

const deleteFlow = (flowId: string) => {
  return BackendAxios.delete(`/test-flows/${flowId}`);
};

const runFlow = (flowId: string) => {
  return BackendAxios.post(`/test-flows/${flowId}/run`);
};

const postFlowAPI = (flowName: Flow["name"]) => {
  return BackendAxios.post(`/test-flows`, { name: flowName });
};

const putFlow = (flow: Flow) => {
  return BackendAxios.put(`/test-flows/${flow.id}`, flow);
};

const postNode = (flowId: string, node: Node) => {
  return BackendAxios.post(`/test-flows/${flowId}/nodes`, node);
};

const deleteNode = (flowId: string, nodeId: string) => {
  return BackendAxios.delete(`/test-flows/${flowId}/nodes/${nodeId}`);
};

const putNode = (flowId: string, node: Node) => {
  return BackendAxios.put(`/test-flows/${flowId}/nodes/${node.id}`, node);
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
  loadNodes: async (flowId: string) => {
    set({ isNodesLoading: true });
    const { data } = await getNodes(flowId).finally(() => {
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
  postFlow: async (flowName: Flow["name"]) => {
    set({ isFlowLoading: true });
    await postFlowAPI(flowName).finally(() => {
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
  postNode: async (flowId: string, node: Node) => {
    set({ isNodeLoading: true });
    await postNode(flowId, node).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes(flowId);
  },
  deleteNode: async (flowId: string, nodeId: string) => {
    set({ isNodeLoading: true });
    await deleteNode(flowId, nodeId).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes(flowId);
  },
  putNode: async (flowId: string, node: Node) => {
    set({ isNodeLoading: true });
    await putNode(flowId, node).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes(flowId);
  },
}));
