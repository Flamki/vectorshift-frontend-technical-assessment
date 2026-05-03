import { useState } from 'react';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'contains');
  const [value, setValue] = useState(data?.value || '');

  const handleConditionChange = (event) => {
    const nextValue = event.target.value;
    setCondition(nextValue);
    updateNodeField(id, 'condition', nextValue);
  };

  const handleValueChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    updateNodeField(id, 'value', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Filter"
      subtitle="Conditional pass-through"
      icon="text"
      handles={[
        { id: `${id}-input`, type: 'target', side: 'left', top: '50%', label: 'Input' },
        { id: `${id}-output`, type: 'source', side: 'right', top: '50%', label: 'Output' },
      ]}
    >
      <Field label="Condition">
        <select value={condition} onChange={handleConditionChange}>
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="regex">Regex</option>
        </select>
      </Field>
      <Field label="Value">
        <input type="text" value={value} onChange={handleValueChange} />
      </Field>
    </BaseNode>
  );
};
