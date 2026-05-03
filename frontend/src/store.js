import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const DRAFT_STORAGE_KEY = 'vectorshift.pipeline.draft.v1';

const getInitialDraft = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.nodes) || !Array.isArray(parsed?.edges)) {
      return null;
    }

    return parsed;
  } catch (error) {
    return null;
  }
};

const initialDraft = getInitialDraft();

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    height: 20,
    width: 20,
  },
};

export const useStore = create((set, get) => ({
  nodeIDs: initialDraft?.nodeIDs || {
    
  },
  nodes: initialDraft?.nodes || [],
  edges: initialDraft?.edges || [],
  getNodeID: (type) => {
    const nextIDs = { ...get().nodeIDs };
    nextIDs[type] = (nextIDs[type] || 0) + 1;
    set({ nodeIDs: nextIDs });
    return `${type}-${nextIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },
  resetCanvas: () => {
    set({
      nodeIDs: {},
      nodes: [],
      edges: [],
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    if (!connection?.source || !connection?.target) {
      return;
    }

    set({
      edges: addEdge({ ...defaultEdgeOptions, ...connection }, get().edges),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            [fieldName]: fieldValue,
          },
        };
      }),
    });
  },
}));
