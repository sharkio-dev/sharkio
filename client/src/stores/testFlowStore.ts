import { create } from "zustand";
import { loadTestFlowsAPI } from "../api/testFlows";

const edges = [
  {
    id: "firstEdge",
    source: "start",
    target: "add",
    animated: true,
  },
];

const nodes = [
  {
    id: "start",
    data: { label: "Hello" },
    position: { x: 50, y: 300 },
    type: "start",
  },
  {
    id: "add",
    data: { label: "Add" },
    position: { x: 200, y: 300 },
    type: "add",
  },
];

type Flow = {
  id: string;
  name: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};

type Node = {
  id: string;
  data: {
    label: string;
  };
  type: string;
  position: {
    x: number;
    y: number;
  };
};

interface TestFlowStore {
  flows: Flow[];
  edges: Edge[];
  nodes: Node[];
  appendNode: () => void;
  loadFlows: () => Promise<Flow[]>;
}

export const useFlowStore = create<TestFlowStore>((set, get) => ({
  flows: [],
  edges: edges,
  nodes: nodes,
  loadFlows: () => {
    return loadTestFlowsAPI().then((data) => {
      set({ flows: data });
      return data;
    });
  },
  appendNode: () => {
    const nodes = get().nodes;
    const nodesLength = nodes.length - 1;
    const edges = get().edges;
    const lastNode = { ...nodes[nodes.length - 1] };

    // Create a new node
    const newNode = {
      id: nodesLength.toString(),
      data: { label: "Step" + nodesLength.toString() },
      position: { x: lastNode.position.x, y: lastNode.position.y },
      type: "test",
    };

    // Change the position of the last node
    lastNode.position.x += 200;

    // Change the target of the last edge
    const lastEdge = edges[edges.length - 1];
    lastEdge.target = newNode.id;

    // Create a new edge
    const newEdge = {
      id: edges.length.toString(),
      source: newNode.id,
      target: lastNode.id,
      animated: true,
    };

    set({
      nodes: [...nodes.slice(0, nodes.length - 1), newNode, lastNode],
      edges: [...edges, newEdge],
    });
  },
}));
