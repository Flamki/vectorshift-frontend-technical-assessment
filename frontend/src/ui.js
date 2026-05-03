import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { NoteNode } from './nodes/noteNode';
import { FilterNode } from './nodes/filterNode';
import { MathNode } from './nodes/mathNode';
import { MergeNode } from './nodes/mergeNode';
import { APINode } from './nodes/apiNode';
import { DelayNode } from './nodes/delayNode';
import { BrowserExtensionNode } from './nodes/browserExtensionNode';
import { RemovableEdge } from './edges/removableEdge';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const DRAFT_STORAGE_KEY = 'vectorshift.pipeline.draft.v1';
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const PINCH_SENSITIVITY = 0.0012;

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  note: NoteNode,
  filter: FilterNode,
  math: MathNode,
  merge: MergeNode,
  api: APINode,
  delay: DelayNode,
  browserExtension: BrowserExtensionNode,
};

const edgeTypes = {
  removable: RemovableEdge,
};

const initialNodeDataByType = {
  customInput: { inputType: 'Text' },
  llm: {},
  customOutput: { outputType: 'Text' },
  text: { text: '{{input}}' },
  note: { contentHtml: '', noteColor: '#e6e98b' },
  filter: { condition: 'contains', value: '' },
  math: { operation: 'add' },
  merge: { strategy: 'append' },
  api: { method: 'GET', url: 'https://api.example.com' },
  delay: { milliseconds: '500' },
  browserExtension: { showOnExtension: true },
};

const selector = (state) => ({
  nodeIDs: state.nodeIDs,
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  resetCanvas: state.resetCanvas,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ isSubheaderCollapsed = false, onToggleSubheader }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [panMode, setPanMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [minimapExpanded, setMinimapExpanded] = useState(false);
  const [zoomLabel, setZoomLabel] = useState(128);
  const [draftState, setDraftState] = useState('saved');
  const saveTimerRef = useRef(null);
  const isFirstSnapshotRef = useRef(true);
  const pinchStateRef = useRef({ rafId: null, targetZoom: null });
  const {
    nodeIDs,
    nodes,
    edges,
    getNodeID,
    addNode,
    resetCanvas,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  useEffect(() => {
    if (isFirstSnapshotRef.current) {
      isFirstSnapshotRef.current = false;
      return;
    }

    setDraftState('saving');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            nodeIDs,
            nodes,
            edges,
            savedAt: Date.now(),
          })
        );
        setDraftState('saved');
      } catch (error) {
        setDraftState('saving');
      }
    }, 550);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [nodeIDs, nodes, edges]);

  useEffect(() => {
    if (!reactFlowInstance) {
      return;
    }

    const pinchState = pinchStateRef.current;

    const handleWheelZoom = (event) => {
      const wrapper = reactFlowWrapper.current;
      if (!wrapper) {
        return;
      }

      const bounds = wrapper.getBoundingClientRect();
      const insideCanvas =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!insideCanvas) {
        return;
      }

      // Trackpad pinch emits a wheel event with ctrlKey on Chromium browsers.
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const baseZoom = pinchState.targetZoom ?? reactFlowInstance.getViewport().zoom;
      const scale = Math.exp(-event.deltaY * PINCH_SENSITIVITY);
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, baseZoom * scale));
      pinchState.targetZoom = nextZoom;

      if (pinchState.rafId !== null) {
        return;
      }

      pinchState.rafId = window.requestAnimationFrame(() => {
        const finalZoom = pinchState.targetZoom ?? reactFlowInstance.getViewport().zoom;
        reactFlowInstance.zoomTo(finalZoom);
        setZoomLabel(Math.round(finalZoom * 100));
        pinchState.rafId = null;
      });
    };

    window.addEventListener('wheel', handleWheelZoom, { passive: false, capture: true });
    return () => {
      if (pinchState.rafId !== null) {
        window.cancelAnimationFrame(pinchState.rafId);
        pinchState.rafId = null;
      }
      pinchState.targetZoom = null;
      window.removeEventListener('wheel', handleWheelZoom, { capture: true });
    };
  }, [reactFlowInstance]);

  const getInitNodeData = (nodeID, type) => {
    return {
      id: nodeID,
      nodeType: type,
      ...(initialNodeDataByType[type] || {}),
    };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const serialized = event.dataTransfer?.getData('application/reactflow');
      if (!serialized) {
        return;
      }

      const appData = JSON.parse(serialized);
      const type = appData?.nodeType;
      if (!type || !nodeTypes[type]) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      const nextNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };

      addNode(nextNode);
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onMove = useCallback((_, viewport) => {
    setZoomLabel(Math.round((viewport.zoom || 1) * 100));
  }, []);

  const handleFitView = useCallback(() => {
    if (!reactFlowInstance) {
      return;
    }
    reactFlowInstance.fitView({ duration: 180, padding: 0.2 });
  }, [reactFlowInstance]);

  // eslint-disable-next-line no-unused-vars
  const handleZoomIn = useCallback(() => {
    if (!reactFlowInstance) {
      return;
    }
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  // eslint-disable-next-line no-unused-vars
  const handleZoomOut = useCallback(() => {
    if (!reactFlowInstance) {
      return;
    }
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  const handleResetDraft = useCallback(() => {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    resetCanvas();
    setDraftState('saved');

    if (reactFlowInstance) {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1.28 }, { duration: 180 });
    }
  }, [resetCanvas, reactFlowInstance]);

  return (
    <section className={`pipeline-canvas ${showGrid ? '' : 'is-grid-hidden'}`.trim()} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMove={onMove}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        snapGrid={[gridSize, gridSize]}
        panOnDrag={panMode}
        panOnScroll
        zoomOnScroll={false}
        zoomOnPinch={false}
        nodesDraggable={!panMode}
        selectionOnDrag={!panMode}
        defaultViewport={{ x: 0, y: 0, zoom: 1.28 }}
      >
        <Controls showInteractive={false} position="bottom-right" style={{ right: 226, bottom: 62 }} />
        <MiniMap
          nodeColor="#b8c2e2"
          maskColor="rgba(20, 30, 48, 0.12)"
          style={{
            width: minimapExpanded ? 250 : 200,
            height: minimapExpanded ? 188 : 150,
            right: 16,
            bottom: 62,
          }}
        />
      </ReactFlow>

      <div className="canvas-mini-toolbar" aria-label="Canvas Toolbar">
        <button type="button" className="canvas-mini-btn" aria-label="Capture view" onClick={handleFitView}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4.5 6.5h2l1-1.5h5l1 1.5h2A1.5 1.5 0 0 1 17 8v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15V8a1.5 1.5 0 0 1 1.5-1.5Z" />
            <circle cx="10" cy="11" r="2.2" />
          </svg>
        </button>
        <button
          type="button"
          className={`canvas-mini-btn ${showGrid ? 'is-active' : ''}`}
          aria-label="Toggle grid"
          onClick={() => setShowGrid((prev) => !prev)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="4" y="4" width="4" height="4" rx="0.8" />
            <rect x="12" y="4" width="4" height="4" rx="0.8" />
            <rect x="4" y="12" width="4" height="4" rx="0.8" />
            <rect x="12" y="12" width="4" height="4" rx="0.8" />
          </svg>
        </button>
        <button type="button" className="canvas-mini-btn" aria-label="Fit canvas" onClick={handleFitView}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12 4h4v4" />
            <path d="m16 4-5.5 5.5" />
            <path d="M8 16H4v-4" />
            <path d="m4 16 5.5-5.5" />
          </svg>
        </button>
        <button
          type="button"
          className={`canvas-mini-btn ${minimapExpanded ? 'is-active' : ''}`}
          aria-label="Expand minimap"
          onClick={() => setMinimapExpanded((prev) => !prev)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M8 4H4v4" />
            <path d="m4 4 5.5 5.5" />
            <path d="M12 16h4v-4" />
            <path d="m16 16-5.5-5.5" />
          </svg>
        </button>
        <button
          type="button"
          className={`canvas-mini-btn ${panMode ? 'is-active' : ''}`}
          aria-label="Pan mode"
          onClick={() => setPanMode((prev) => !prev)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 2.5v6.2" />
            <path d="M7.2 8.1V5.8" />
            <path d="M12.8 8.1V6.2" />
            <path d="M15 9.2V7.9" />
            <path d="M5.5 10.2 7 15.5c.3 1.2 1.4 2 2.6 2h2.3c1.8 0 3.2-1.5 3.1-3.2l-.2-5.1" />
          </svg>
        </button>
      </div>

      <div className="canvas-zoom-label" aria-live="polite">
        {zoomLabel}%
      </div>

      <button
        type="button"
        className={`canvas-collapse-btn ${isSubheaderCollapsed ? 'is-collapsed' : ''}`}
        onClick={onToggleSubheader}
        aria-label={isSubheaderCollapsed ? 'Expand subheader' : 'Collapse subheader'}
      >
        <span
          aria-hidden="true"
          className={`canvas-collapse-btn__icon ${isSubheaderCollapsed ? 'is-plus' : 'is-cross'}`}
        />
      </button>
      <aside className="canvas-status" aria-label="Save status">
        <p>
          <span
            className={`canvas-status__dot ${draftState === 'saved' ? 'is-saved' : 'is-saving'}`}
            aria-hidden="true"
          />
          {draftState === 'saved' ? 'Draft saved' : 'Saving...'}
        </p>
        <div className="canvas-status__avatars" aria-hidden="true">
          <span className="avatar avatar--gold">A</span>
          <span className="avatar avatar--blue">A</span>
        </div>
        <button type="button" className="canvas-reset-btn" onClick={handleResetDraft}>
          Reset draft
        </button>
      </aside>
      <div className="workspace-footer" aria-hidden="true">
        <button type="button" className="workspace-footer__primary">New Workflow</button>
        <button type="button" className="workspace-footer__icon">=</button>
        <button type="button" className="workspace-footer__icon">+</button>
      </div>
    </section>
  );
};

