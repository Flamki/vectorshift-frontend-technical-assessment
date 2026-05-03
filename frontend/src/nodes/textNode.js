import { useMemo, useRef, useState, useEffect } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { BaseNode, Field } from './baseNode';
import { useStore } from '../store';

const VARIABLE_REGEX = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
const MIN_WIDTH = 280;
const MAX_WIDTH = 520;
const MIN_HEIGHT = 150;
const MAX_HEIGHT = 360;

const getVariablesFromText = (text) => {
  const seen = new Set();
  const variables = [];

  for (const match of text.matchAll(VARIABLE_REGEX)) {
    const variableName = match[1];
    if (!seen.has(variableName)) {
      seen.add(variableName);
      variables.push(variableName);
    }
  }

  return variables;
};

const getNodeSize = (text) => {
  const lines = text.split('\n');
  const longestLineLength = lines.reduce(
    (maxLength, line) => Math.max(maxLength, line.length),
    0
  );

  const nextWidth = Math.min(
    MAX_WIDTH,
    Math.max(MIN_WIDTH, 160 + longestLineLength * 7)
  );
  const nextHeight = Math.min(
    MAX_HEIGHT,
    Math.max(MIN_HEIGHT, 120 + lines.length * 24)
  );

  return {
    width: nextWidth,
    minHeight: nextHeight,
  };
};

export const TextNode = ({ id, data }) => {
  const initialText = data?.text || '{{input}}';
  const [currText, setCurrText] = useState(initialText);
  const [nodeSize, setNodeSize] = useState(getNodeSize(initialText));
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textAreaRef = useRef(null);

  const variables = useMemo(() => getVariablesFromText(currText), [currText]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables, updateNodeInternals]);

  const handleTextChange = (event) => {
    const nextText = event.target.value;
    setCurrText(nextText);
    setNodeSize(getNodeSize(nextText));
    updateNodeField(id, 'text', nextText);
  };

  useEffect(() => {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = '0px';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, [currText]);

  const variableHandles = variables.map((variableName, index) => {
    const top = ((index + 1) / (variables.length + 1)) * 100;
    return {
      id: `${id}-var-${variableName}`,
      type: 'target',
      side: 'left',
      top,
      label: variableName,
    };
  });

  return (
    <BaseNode
      nodeId={id}
      title="Text"
      subtitle="Interpolated template"
      icon="text"
      style={nodeSize}
      handles={[
        ...variableHandles,
        { id: `${id}-output`, type: 'source', side: 'right', top: '50%', label: 'Output' },
      ]}
    >
      <Field label="Template">
        <textarea
          ref={textAreaRef}
          rows={2}
          value={currText}
          onChange={handleTextChange}
          placeholder="Use variables like {{input}}"
        />
      </Field>
    </BaseNode>
  );
};
