import { useState } from 'react';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [strategy, setStrategy] = useState(data?.strategy || 'append');

  const handleStrategyChange = (event) => {
    const nextValue = event.target.value;
    setStrategy(nextValue);
    updateNodeField(id, 'strategy', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Merge"
      subtitle="Combine two branches"
      icon="merge"
      handles={[
        { id: `${id}-primary`, type: 'target', side: 'left', top: '35%', label: 'Primary' },
        { id: `${id}-secondary`, type: 'target', side: 'left', top: '70%', label: 'Secondary' },
        { id: `${id}-merged`, type: 'source', side: 'right', top: '50%', label: 'Merged' },
      ]}
    >
      <Field label="Strategy">
        <select value={strategy} onChange={handleStrategyChange}>
          <option value="append">Append</option>
          <option value="interleave">Interleave</option>
          <option value="json">JSON Merge</option>
        </select>
      </Field>
    </BaseNode>
  );
};
