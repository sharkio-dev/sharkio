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
  type: string;
}
export interface NodeRunType {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
  type: "http" | "subflow";
  assertionsResult: {
    passed: AssertionResult[];
    failed: AssertionResult[];
    success: boolean;
  };
  response: {
    context?: Record<string, NodeRunType>;
    status: number;
    headers: Record<string, string>;
    body: string;
  };
  nodeId: string;
  ownerId: string;
  flowId: string;
  subFlowId?: string;
  subFlowRunId?: string;
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
  type: "http" | "subflow";
  subFlowId: string;
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
  loadFlows: (isLoading?: boolean, type?: string) => Promise<void>;
  loadNodes: (flowId: string, isLoading?: boolean) => Promise<NodeType[]>;
  loadFlowRuns: (flowId: string, isLoading?: boolean) => void;
  loadNode: (
    flowId: string,
    id: string,
    isLoading?: boolean,
  ) => Promise<NodeType>;
  loadNodeRuns: (
    flowId: string,
    runId: string,
    isLoading?: boolean,
  ) => Promise<NodeRunType[]>;
  deleteFlow: (
    flowId: string,
    isLoading?: boolean,
    type?: string,
  ) => Promise<void>;
  runFlow: (flowId: string, isLoading?: boolean) => Promise<any>;
  postFlow: (
    flow: FlowType["name"],
    isLoading?: boolean,
    type?: string,
  ) => Promise<FlowType>;
  putFlow: (
    flow: FlowType,
    isLoading?: boolean,
    type?: string,
  ) => Promise<void>;
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
  reorderNodes: (flowId: string, nodes: NodeType["id"][]) => Promise<void>;
}

export const getFlows = (type?: string) => {
  return BackendAxios.get("/test-flows", {
    params: {
      type,
    },
  });
};

export const getNodes = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes?isSorted=true`);
};

const getTestRuns = (flowId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/runs?isSorted=true`);
};

const getNode = (flowId: string, nodeId: string) => {
  return BackendAxios.get(`/test-flows/${flowId}/nodes/${nodeId}`);
};

const getRun = (flowId: string, runId: string) => {
  return BackendAxios.get(
    `/test-flows/${flowId}/runs/${runId}/node-runs?isSorted=true`,
  );
};

const deleteFlow = (flowId: string) => {
  return BackendAxios.delete(`/test-flows/${flowId}`);
};

const runFlow = (flowId: string) => {
  return BackendAxios.post(`/test-flows/${flowId}/execute`);
};

const postFlowAPI = (flowName: FlowType["name"], type = "flow") => {
  return BackendAxios.post(`/test-flows`, {
    name: flowName,
    type,
  }).then((res) => {
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

const reorderNodes = (flowId: string, nodes: NodeType["id"][]) => {
  return BackendAxios.post(`/test-flows/${flowId}/reorder-nodes`, nodes);
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
  loadFlows: async (isLoading = false, type = "flow") => {
    if (isLoading) {
      set({ isFlowsLoading: true });
    }
    const { data } = await getFlows(type).finally(() => {
      set({ isFlowsLoading: false });
    });
    set({ flows: data || [] });

    return data;
  },
  loadNodes: async (flowId: string, isLoading = false) => {
    if (isLoading) {
      set({ isNodesLoading: true });
    }

    return getNodes(flowId)
      .then(({ data }) => {
        set({ nodes: data || [] });
        return data;
      })
      .finally(() => {
        set({ isNodesLoading: false });
      });
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
  deleteFlow: async (flowId: string, isLoading = false, type = "flow") => {
    if (isLoading) {
      set({ isFlowLoading: true });
    }
    return await deleteFlow(flowId)
      .then(() => {
        get().loadFlows(isLoading, type);
        set({ nodes: [] });
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
  postFlow: async (
    flowName: FlowType["name"],
    isLoading = false,
    type = "flow",
  ) => {
    if (isLoading) {
      set({ isFlowLoading: true });
    }
    return await postFlowAPI(flowName, type)
      .then((res) => {
        get().loadFlows(isLoading, type);
        return res;
      })
      .finally(() => {
        set({ isFlowLoading: false });
      });
  },
  putFlow: async (flow: FlowType, isLoading = false, type = "flow") => {
    if (isLoading) {
      set({ isFlowLoading: true });
    }
    await putFlow(flow).finally(() => {
      set({ isFlowLoading: false });
    });
    get().loadFlows(isLoading, type);
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
      .then((res) => {
        get().reorderNodes(flowId, [
          ...get().nodes.map((node) => node.id),
          res.data.id,
        ]);
      })
      .finally(() => {
        set({ isNodeLoading: false });
      });
  },
  deleteNode: async (flowId: string, nodeId: string, isLoading = false) => {
    if (isLoading) {
      set({ isNodeLoading: true });
    }
    await deleteNode(flowId, nodeId)
      .then(() => {
        const newNodes = get().nodes.filter((node) => node.id !== nodeId);
        get().reorderNodes(
          flowId,
          newNodes.map((node) => node.id),
        );
      })
      .finally(() => {
        set({ isNodeLoading: false });
      });
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
    get().loadNodes(flowId);
  },
  reorderNodes: async (flowId: string, nodesIds: NodeType["id"][]) => {
    set({
      nodes: get().nodes.sort(
        (a, b) => nodesIds.indexOf(a.id) - nodesIds.indexOf(b.id),
      ),
    });
    reorderNodes(flowId, nodesIds).then(() => get().loadNodes(flowId));
  },
}));
