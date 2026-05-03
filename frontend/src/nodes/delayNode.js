import { useState } from 'react';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [milliseconds, setMilliseconds] = useState(data?.milliseconds || '500');

  const handleMillisecondsChange = (event) => {
    const nextValue = event.target.value;
    setMilliseconds(nextValue);
    updateNodeField(id, 'milliseconds', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Delay"
      subtitle="Throttle flow"
      icon="note"
      handles={[
        { id: `${id}-input`, type: 'target', side: 'left', top: '50%', label: 'Input' },
        { id: `${id}-output`, type: 'source', side: 'right', top: '50%', label: 'Output' },
      ]}
    >
      <Field label="Milliseconds">
        <input
          type="number"
          min="0"
          step="50"
          value={milliseconds}
          onChange={handleMillisecondsChange}
        />
      </Field>
    </BaseNode>
  );
};
