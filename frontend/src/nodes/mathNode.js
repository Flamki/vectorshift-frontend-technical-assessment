import { useState } from 'react';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

export const MathNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [operation, setOperation] = useState(data?.operation || 'add');

  const handleOperationChange = (event) => {
    const nextValue = event.target.value;
    setOperation(nextValue);
    updateNodeField(id, 'operation', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Math"
      subtitle="Numeric transform"
      icon="math"
      handles={[
        { id: `${id}-a`, type: 'target', side: 'left', top: '46%', label: 'A' },
        { id: `${id}-b`, type: 'target', side: 'left', top: '78%', label: 'B' },
        { id: `${id}-result`, type: 'source', side: 'right', top: '50%', label: 'Result' },
      ]}
    >
      <Field label="Operation">
        <select value={operation} onChange={handleOperationChange}>
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
      </Field>
    </BaseNode>
  );
};
