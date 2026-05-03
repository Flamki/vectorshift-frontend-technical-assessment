import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const isVercelHost =
  typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');

const FALLBACK_BACKEND_URL = 'https://backend-omega-three-93.vercel.app';
const configuredApiUrl = (process.env.REACT_APP_API_URL || '').trim();

const getApiBaseCandidates = () => {
  if (isVercelHost) {
    return ['/api', configuredApiUrl, FALLBACK_BACKEND_URL].filter(Boolean);
  }

  return [configuredApiUrl, 'http://127.0.0.1:8000', 'http://localhost:8000'].filter(Boolean);
};

const INPUT_NODE_TYPES = new Set(['customInput', 'browserExtension']);
const OUTPUT_NODE_TYPES = new Set(['customOutput']);

const analyzePipelineStructure = (nodes, edges) => {
  const warnings = [];
  const nodeById = new Map();

  nodes.forEach((node) => {
    nodeById.set(String(node.id), node);
  });

  const inputs = nodes.filter((node) => INPUT_NODE_TYPES.has(node.type));
  const outputs = nodes.filter((node) => OUTPUT_NODE_TYPES.has(node.type));

  if (inputs.length === 0) {
    warnings.push('No input node found. Add at least one Input or Browser Extension node.');
  }

  if (outputs.length === 0) {
    warnings.push('No output node found. Add at least one Output node.');
  }

  const adjacency = new Map();
  const indegree = new Map();
  const degree = new Map();

  nodes.forEach((node) => {
    const id = String(node.id);
    adjacency.set(id, []);
    indegree.set(id, 0);
    degree.set(id, 0);
  });

  edges.forEach((edge) => {
    const source = String(edge.source);
    const target = String(edge.target);

    if (!adjacency.has(source) || !adjacency.has(target)) {
      warnings.push('Some edges reference missing nodes. Reconnect or remove invalid edges.');
      return;
    }

    adjacency.get(source).push(target);
    indegree.set(target, (indegree.get(target) || 0) + 1);
    degree.set(source, (degree.get(source) || 0) + 1);
    degree.set(target, (degree.get(target) || 0) + 1);
  });

  const outputsWithoutInput = outputs.filter((node) => (indegree.get(String(node.id)) || 0) === 0);
  if (outputsWithoutInput.length > 0) {
    warnings.push('One or more Output nodes are not connected to upstream nodes.');
  }

  if (inputs.length > 0 && outputs.length > 0) {
    const reachable = new Set();
    const queue = [];

    inputs.forEach((node) => {
      const id = String(node.id);
      reachable.add(id);
      queue.push(id);
    });

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = adjacency.get(current) || [];
      neighbors.forEach((neighbor) => {
        if (reachable.has(neighbor)) {
          return;
        }
        reachable.add(neighbor);
        queue.push(neighbor);
      });
    }

    const unreachableOutputs = outputs.filter((node) => !reachable.has(String(node.id)));
    if (unreachableOutputs.length > 0) {
      warnings.push('One or more Output nodes are unreachable from any Input node.');
    }
  }

  const isolatedNodes = nodes.filter((node) => (degree.get(String(node.id)) || 0) === 0);
  if (isolatedNodes.length > 0) {
    warnings.push(`Found ${isolatedNodes.length} isolated node(s) with no connections.`);
  }

  const dedupedWarnings = Array.from(new Set(warnings));
  return { warnings: dedupedWarnings, warningsCount: dedupedWarnings.length };
};

const requestPipelineParse = async (nodes, edges) => {
  const candidates = Array.from(new Set(getApiBaseCandidates()));
  let lastNetworkError = null;
  let lastHttpError = null;

  for (const baseUrl of candidates) {
    const endpoint = `${baseUrl}/pipelines/parse`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (response.ok) {
        return await response.json();
      }

      const errorPayload = await response.text();
      lastHttpError = `${response.status} from ${endpoint}${errorPayload ? `: ${errorPayload}` : ''}`;
    } catch (error) {
      lastNetworkError = `${endpoint} (${error.message})`;
    }
  }

  if (lastHttpError) {
    throw new Error(lastHttpError);
  }

  if (lastNetworkError) {
    throw new Error(`Failed to fetch (${lastNetworkError})`);
  }

  throw new Error('No API endpoint available.');
};

export const SubmitButton = ({ inline = false, label = 'Submit', className = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { nodes, edges } = useStore(selector, shallow);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = await requestPipelineParse(nodes, edges);
      const structure = analyzePipelineStructure(nodes, edges);
      const structureText =
        structure.warningsCount === 0
          ? 'Structure checks: Passed'
          : `Structure warnings (${structure.warningsCount}):\n- ${structure.warnings.join('\n- ')}`;

      alert(
        `Pipeline analysis complete.\n\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nIs DAG: ${result.is_dag ? 'Yes' : 'No'}\n\n${structureText}`
      );
    } catch (error) {
      alert(`Could not parse pipeline. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const button = (
    <button
      type="button"
      className={`submit-button ${className}`.trim()}
      disabled={isSubmitting}
      onClick={onSubmit}
    >
      {isSubmitting ? 'Submitting...' : label}
    </button>
  );

  if (inline) {
    return button;
  }

  return <footer className="submit-row">{button}</footer>;
};
