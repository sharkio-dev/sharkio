import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";

export interface FlowType {
  id: string;
  name: string;
  executionType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface AssertionType {
  path: string;
  comparator: string;
  expectedValue: string;
}

export interface NodeType {
  id: string;
  ownerId: string;
  flowId: string;
  proxyId: string;
  name: string;
  url: string;
  body: string;
  snifferId: string;
  headers: {};
  assertions: AssertionType[];
  method: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestRunType {
  id: string;
  status: string;
  flowId: string;
  createdAt: string;
}

interface flowState {
  flows: FlowType[];
  nodes: NodeType[];
  runs: TestRunType[];
  isFlowsLoading: boolean;
  isNodesLoading: boolean;
  isRunsLoading: boolean;
  isRunLoading: boolean;
  isNodeLoading: boolean;
  isFlowLoading: boolean;
  loadFlows: () => void;
  loadNodes: (flowId: string) => void;
  loadTestRuns: (flowId: string) => void;
  loadNode: (flowId: string, id: string) => Promise<NodeType>;
  loadRun: (flowId: string, id: string) => Promise<TestRunType>;
  deleteFlow: (flowId: string) => Promise<void>;
  runFlow: (flowId: string) => void;
  postFlow: (flow: FlowType["name"]) => Promise<FlowType>;
  putFlow: (flow: FlowType) => void;
  postNode: (flowId: string, node: Partial<NodeType>) => void;
  deleteNode: (flowId: string, nodeId: string) => void;
  putNode: (flowId: string, node: Partial<NodeType>) => Promise<void>;
}

const getFlows = () => {
  return BackendAxios.get("/test-flows");
};

const getNodes = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes`);
};

const getTestRuns = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/runs`);
};

const getNode = (flowId: string, nodeId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes/${nodeId}`);
};

const getRun = (flowId: string, runId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/runs/${runId}/node-runs`);
};

const deleteFlow = (flowId: string) => {
  return BackendAxios.delete(`/test-flows/${flowId}`);
};

const runFlow = (flowId: string) => {
  return BackendAxios.post(`/test-flows/${flowId}/execute`);
};

const postFlowAPI = (flowName: FlowType["name"]) => {
  return BackendAxios.post(`/test-flows`, { name: flowName }).then((res) => {
    return res.data;
  });
};

const putFlow = (flow: FlowType) => {
  return BackendAxios.put(`/test-flows/${flow.id}`, flow);
};

const postNode = (flowId: string, node: Partial<NodeType>) => {
  return BackendAxios.post(`/test-flows/${flowId}/nodes`, node);
};

const deleteNode = (flowId: string, nodeId: string) => {
  return BackendAxios.delete(`/test-flows/${flowId}/nodes/${nodeId}`);
};

const putNode = (flowId: string, node: Partial<NodeType>) => {
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
  loadTestRuns: async (flowId: string) => {
    set({ isRunsLoading: true });
    const { data } = await getTestRuns(flowId).finally(() => {
      set({ isRunsLoading: false });
    });
    console.log(data);
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
    return await deleteFlow(flowId)
      .then(() => {
        get().loadFlows();
      })
      .finally(() => {
        set({ isFlowLoading: false });
      });
  },
  runFlow: async (flowId: string) => {
    set({ isFlowLoading: true });
    await runFlow(flowId).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadTestRuns(flowId);
  },
  postFlow: async (flowName: FlowType["name"]) => {
    set({ isFlowLoading: true });
    return await postFlowAPI(flowName)
      .then((res) => {
        get().loadFlows();
        return res;
      })
      .finally(() => {
        set({ isFlowLoading: false });
      });
  },
  putFlow: async (flow: FlowType) => {
    set({ isFlowLoading: true });
    await putFlow(flow).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadFlows();
  },
  postNode: async (flowId: string, node: Partial<NodeType>) => {
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
  putNode: async (flowId: string, node: Partial<NodeType>) => {
    set({ isNodeLoading: true });
    await putNode(flowId, node).finally(() => {
      set({ isNodeLoading: false });
    });
    return get().loadNodes(flowId);
  },
}));
