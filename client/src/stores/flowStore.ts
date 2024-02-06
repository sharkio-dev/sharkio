import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";
export interface AssertionResult {
  path: string;
  comparator: string;
  expectedValue: string;
  actualValue: string;
  isPassed: boolean;
}
interface AssertionType {
  path: string;
  comparator: string;
  expectedValue: string;
}
export interface NodeRunType {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
  assertionsResult: {
    passed: AssertionResult[];
    failed: AssertionResult[];
    success: boolean;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
  nodeId: string;
  ownerId: string;
  flowId: string;
  flowRunId: string;
  proxyId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  assertions: AssertionType[];
}
export interface FlowType {
  id: string;
  name: string;
  executionType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
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

interface flowState {
  flows: FlowType[];
  nodes: NodeType[];
  runs: NodeRunType[];
  isFlowsLoading: boolean;
  isNodesLoading: boolean;
  isRunsLoading: boolean;
  isRunLoading: boolean;
  isNodeLoading: boolean;
  isFlowLoading: boolean;
  isFlowRunning: boolean;
  loadFlows: (isLoading?: boolean) => void;
  loadNodes: (flowId: string, isLoading?: boolean) => void;
  loadFlowRuns: (flowId: string, isLoading?: boolean) => void;
  loadNode: (
    flowId: string,
    id: string,
    isLoading?: boolean,
  ) => Promise<NodeType>;
  loadNodeRuns: (
    flowId: string,
    id: string,
    isLoading?: boolean,
  ) => Promise<NodeRunType[]>;
  deleteFlow: (flowId: string, isLoading?: boolean) => Promise<void>;
  runFlow: (flowId: string, isLoading?: boolean) => Promise<any>;
  postFlow: (flow: FlowType["name"], isLoading?: boolean) => Promise<FlowType>;
  putFlow: (flow: FlowType, isLoading?: boolean) => Promise<void>;
  postNode: (
    flowId: string,
    node: Partial<NodeType>,
    isLoading?: boolean,
  ) => Promise<void>;
  deleteNode: (
    flowId: string,
    nodeId: string,
    isLoading?: boolean,
  ) => Promise<void>;
  putNode: (
    flowId: string,
    node: Partial<NodeType>,
    isLoading?: boolean,
  ) => Promise<void>;
}

const getFlows = () => {
  return BackendAxios.get("/test-flows");
};

const getNodes = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes`);
};

const getTestRuns = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/runs?isSorted=true`);
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
  isFlowRunning: false,
  loadFlows: async (isLoading = false) => {
    if (isLoading) {
      set({ isFlowsLoading: true });
    }
    const { data } = await getFlows().finally(() => {
      set({ isFlowsLoading: false });
    });
    set({ flows: data || [] });
  },
  loadNodes: async (flowId: string, isLoading = false) => {
    if (isLoading) {
      set({ isNodesLoading: true });
    }

    const { data } = await getNodes(flowId).finally(() => {
      set({ isNodesLoading: false });
    });
    set({ nodes: data || [] });
  },
  loadFlowRuns: async (flowId: string, isLoading = false) => {
    if (isLoading) {
      set({ isRunsLoading: true });
    }
    const { data } = await getTestRuns(flowId).finally(() => {
      set({ isRunsLoading: false });
    });
    set({ runs: data || [] });
  },
  loadNode: async (flowId: string, nodeId: string, isLoading = false) => {
    if (isLoading) {
      set({ isNodeLoading: true });
    }
    const { data } = await getNode(flowId, nodeId).finally(() => {
      set({ isNodeLoading: false });
    });
    return data;
  },
  loadNodeRuns: async (flowId: string, runId: string, isLoading = false) => {
    if (isLoading) {
      set({ isRunLoading: true });
    }
    const { data } = await getRun(flowId, runId).finally(() => {
      set({ isRunLoading: false });
    });
    return data;
  },
  deleteFlow: async (flowId: string, isLoading = false) => {
    if (isLoading) {
      set({ isFlowLoading: true });
    }
    return await deleteFlow(flowId)
      .then(() => {
        get().loadFlows();
      })
      .finally(() => {
        set({ isFlowLoading: false });
      });
  },
  runFlow: async (flowId: string, isLoading = false) => {
    if (isLoading) {
      set({ isFlowRunning: true });
    }
    return runFlow(flowId).finally(() => {
      set({ isFlowRunning: false });
    });
  },
  postFlow: async (flowName: FlowType["name"], isLoading = false) => {
    if (isLoading) {
      set({ isFlowLoading: true });
    }
    return await postFlowAPI(flowName)
      .then((res) => {
        get().loadFlows();
        return res;
      })
      .finally(() => {
        set({ isFlowLoading: false });
      });
  },
  putFlow: async (flow: FlowType, isLoading = false) => {
    if (isLoading) {
      set({ isFlowLoading: true });
    }
    await putFlow(flow).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadFlows();
  },
  postNode: async (
    flowId: string,
    node: Partial<NodeType>,
    isLoading = false,
  ) => {
    if (isLoading) {
      set({ isNodeLoading: true });
    }
    return await postNode(flowId, node)
      .then(() => {
        get().loadNodes(flowId);
      })
      .finally(() => {
        set({ isNodeLoading: false });
      });
  },
  deleteNode: async (flowId: string, nodeId: string, isLoading = false) => {
    if (isLoading) {
      set({ isNodeLoading: true });
    }
    await deleteNode(flowId, nodeId).finally(() => {
      set({ isNodeLoading: false });
    });
    get().loadNodes(flowId);
  },
  putNode: async (
    flowId: string,
    node: Partial<NodeType>,
    isLoading = false,
  ) => {
    if (isLoading) {
      set({ isNodeLoading: true });
    }
    await putNode(flowId, node).finally(() => {
      set({ isNodeLoading: false });
    });
    return get().loadNodes(flowId);
  },
}));
