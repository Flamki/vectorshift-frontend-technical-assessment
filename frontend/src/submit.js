import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const SubmitButton = ({ inline = false, label = 'Submit', className = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { nodes, edges } = useStore(selector, shallow);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const errorPayload = await response.text();
        throw new Error(errorPayload || `Request failed with status ${response.status}`);
      }

      const result = await response.json();
      alert(
        `Pipeline analysis complete.\n\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nIs DAG: ${result.is_dag ? 'Yes' : 'No'}`
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
