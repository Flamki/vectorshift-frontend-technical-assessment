import { BaseNode } from './baseNode';

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      nodeId={id}
      title="LLM"
      subtitle="Prompt orchestration"
      icon="text"
      handles={[
        { id: `${id}-system`, type: 'target', side: 'left', top: '40%', label: 'System' },
        { id: `${id}-prompt`, type: 'target', side: 'left', top: '74%', label: 'Prompt' },
        { id: `${id}-response`, type: 'source', side: 'right', top: '50%', label: 'Response' },
      ]}
    >
      <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13 }}>
        Compose context and generate model output.
      </p>
    </BaseNode>
  );
};
