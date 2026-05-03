import { useState } from 'react';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(
    data?.outputName || id.replace('customOutput-', 'output_')
  );
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  const handleNameChange = (event) => {
    const nextValue = event.target.value;
    setCurrName(nextValue);
    updateNodeField(id, 'outputName', nextValue);
  };

  const handleTypeChange = (event) => {
    const nextValue = event.target.value;
    setOutputType(nextValue);
    updateNodeField(id, 'outputType', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Output"
      subtitle="Pipeline result"
      icon="output"
      handles={[{ id: `${id}-value`, type: 'target', side: 'left', top: '50%' }]}
    >
      <Field label="Name">
        <input type="text" value={currName} onChange={handleNameChange} />
      </Field>
      <Field label="Type">
        <select value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </Field>
    </BaseNode>
  );
};
