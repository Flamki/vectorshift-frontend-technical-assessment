import { useState } from 'react';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');

  const handleUrlChange = (event) => {
    const nextValue = event.target.value;
    setUrl(nextValue);
    updateNodeField(id, 'url', nextValue);
  };

  const handleMethodChange = (event) => {
    const nextValue = event.target.value;
    setMethod(nextValue);
    updateNodeField(id, 'method', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="API"
      subtitle="External request"
      icon="output"
      handles={[
        { id: `${id}-payload`, type: 'target', side: 'left', top: '50%', label: 'Payload' },
        { id: `${id}-response`, type: 'source', side: 'right', top: '36%', label: 'Response' },
        { id: `${id}-status`, type: 'source', side: 'right', top: '70%', label: 'Status' },
      ]}
    >
      <Field label="Method">
        <select value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </Field>
      <Field label="URL">
        <input type="text" value={url} onChange={handleUrlChange} />
      </Field>
    </BaseNode>
  );
};
