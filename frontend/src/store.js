import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const DRAFT_STORAGE_KEY = 'vectorshift.pipeline.draft.v1';
const PERSISTED_EDGE_DEFAULTS = {
  type: 'removable',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    height: 20,
    width: 20,
  },
};

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

    return {
      ...parsed,
      edges: parsed.edges.map((edge) => ({
        ...PERSISTED_EDGE_DEFAULTS,
        ...edge,
        type: 'removable',
      })),
    };
  } catch (error) {
    return null;
  }
};

const initialDraft = getInitialDraft();

const defaultEdgeOptions = {
  type: 'removable',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    height: 20,
    width: 20,
  },
};

const createDemoPipeline = () => {
  const nodes = [
    {
      id: 'browserExtension-1',
      type: 'browserExtension',
      position: { x: 70, y: 70 },
      data: {
        id: 'browserExtension-1',
        nodeType: 'browserExtension',
        name: 'browser_extension_0',
        showOnExtension: true,
      },
    },
    {
      id: 'customInput-1',
      type: 'customInput',
      position: { x: 70, y: 420 },
      data: {
        id: 'customInput-1',
        nodeType: 'customInput',
        inputName: 'input_0',
        inputType: 'Text',
        description: 'Primary user input text for the pipeline.',
        useDefaultValue: false,
      },
    },
    {
      id: 'text-1',
      type: 'text',
      position: { x: 520, y: 80 },
      data: {
        id: 'text-1',
        nodeType: 'text',
        text: 'Create a concise response for {{input}} from {{customer_id}}.',
      },
    },
    {
      id: 'filter-1',
      type: 'filter',
      position: { x: 520, y: 420 },
      data: {
        id: 'filter-1',
        nodeType: 'filter',
        condition: 'contains',
        value: 'priority',
      },
    },
    {
      id: 'llm-1',
      type: 'llm',
      position: { x: 900, y: 120 },
      data: {
        id: 'llm-1',
        nodeType: 'llm',
      },
    },
    {
      id: 'api-1',
      type: 'api',
      position: { x: 1260, y: 70 },
      data: {
        id: 'api-1',
        nodeType: 'api',
        method: 'POST',
        url: 'https://api.example.com/analyze',
      },
    },
    {
      id: 'math-1',
      type: 'math',
      position: { x: 1260, y: 360 },
      data: {
        id: 'math-1',
        nodeType: 'math',
        operation: 'add',
      },
    },
    {
      id: 'merge-1',
      type: 'merge',
      position: { x: 1620, y: 220 },
      data: {
        id: 'merge-1',
        nodeType: 'merge',
        strategy: 'append',
      },
    },
    {
      id: 'delay-1',
      type: 'delay',
      position: { x: 1970, y: 220 },
      data: {
        id: 'delay-1',
        nodeType: 'delay',
        milliseconds: '500',
      },
    },
    {
      id: 'customOutput-1',
      type: 'customOutput',
      position: { x: 2310, y: 220 },
      data: {
        id: 'customOutput-1',
        nodeType: 'customOutput',
        outputName: 'output_0',
        outputType: 'Text',
      },
    },
    {
      id: 'note-1',
      type: 'note',
      position: { x: 900, y: 600 },
      data: {
        id: 'note-1',
        nodeType: 'note',
        noteColor: '#e6e98b',
        contentHtml:
          '<h3>Demo checklist</h3><p>1. Edit nodes<br>2. Connect edges<br>3. Click Save to parse DAG</p>',
      },
    },
  ];

  const edges = [
    {
      id: 'e-input-text',
      source: 'customInput-1',
      sourceHandle: 'customInput-1-value',
      target: 'text-1',
      targetHandle: 'text-1-var-input',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-input-filter',
      source: 'customInput-1',
      sourceHandle: 'customInput-1-value',
      target: 'filter-1',
      targetHandle: 'filter-1-input',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-text-llm',
      source: 'text-1',
      sourceHandle: 'text-1-output',
      target: 'llm-1',
      targetHandle: 'llm-1-prompt',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-filter-llm',
      source: 'filter-1',
      sourceHandle: 'filter-1-output',
      target: 'llm-1',
      targetHandle: 'llm-1-system',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-llm-api',
      source: 'llm-1',
      sourceHandle: 'llm-1-response',
      target: 'api-1',
      targetHandle: 'api-1-payload',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-api-merge',
      source: 'api-1',
      sourceHandle: 'api-1-response',
      target: 'merge-1',
      targetHandle: 'merge-1-primary',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-api-math',
      source: 'api-1',
      sourceHandle: 'api-1-status',
      target: 'math-1',
      targetHandle: 'math-1-a',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-input-math',
      source: 'customInput-1',
      sourceHandle: 'customInput-1-value',
      target: 'math-1',
      targetHandle: 'math-1-b',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-math-merge',
      source: 'math-1',
      sourceHandle: 'math-1-result',
      target: 'merge-1',
      targetHandle: 'merge-1-secondary',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-merge-delay',
      source: 'merge-1',
      sourceHandle: 'merge-1-merged',
      target: 'delay-1',
      targetHandle: 'delay-1-input',
      ...defaultEdgeOptions,
    },
    {
      id: 'e-delay-output',
      source: 'delay-1',
      sourceHandle: 'delay-1-output',
      target: 'customOutput-1',
      targetHandle: 'customOutput-1-value',
      ...defaultEdgeOptions,
    },
  ];

  const nodeIDs = {
    browserExtension: 1,
    customInput: 1,
    text: 1,
    filter: 1,
    llm: 1,
    api: 1,
    math: 1,
    merge: 1,
    delay: 1,
    customOutput: 1,
    note: 1,
  };

  return { nodeIDs, nodes, edges };
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
  removeEdgeById: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },
  resetCanvas: () => {
    set({
      nodeIDs: {},
      nodes: [],
      edges: [],
    });
  },
  loadDemoPipeline: () => {
    const demo = createDemoPipeline();
    set(demo);
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

    const currentEdges = get().edges;
    const normalizedTargetHandle = connection.targetHandle ?? null;

    const edgesWithoutReplacedInput = currentEdges.filter(
      (edge) =>
        !(
          edge.target === connection.target &&
          (edge.targetHandle ?? null) === normalizedTargetHandle
        )
    );

    const duplicateEdgeExists = edgesWithoutReplacedInput.some(
      (edge) =>
        edge.source === connection.source &&
        edge.target === connection.target &&
        (edge.sourceHandle ?? null) === (connection.sourceHandle ?? null) &&
        (edge.targetHandle ?? null) === normalizedTargetHandle
    );

    if (duplicateEdgeExists) {
      return;
    }

    set({
      edges: addEdge(
        { ...defaultEdgeOptions, ...connection },
        edgesWithoutReplacedInput
      ),
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
