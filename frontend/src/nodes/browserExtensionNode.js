import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const BrowserExtensionNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [name, setName] = useState(data?.name || id.replace('browserExtension-', 'browser_extension_'));
  const [showOnExtension, setShowOnExtension] = useState(
    data?.showOnExtension !== undefined ? Boolean(data.showOnExtension) : true
  );
  const [detailsOpen, setDetailsOpen] = useState(true);

  const handleNameChange = (event) => {
    const nextValue = event.target.value;
    setName(nextValue);
    updateNodeField(id, 'name', nextValue);
  };

  const handleToggleChange = (event) => {
    const nextValue = event.target.checked;
    setShowOnExtension(nextValue);
    updateNodeField(id, 'showOnExtension', nextValue);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Browser Extension"
      subtitle="Run a VectorShift workflow using the current page captured by the VectorShift chrome extension as input."
      icon="browser"
      className="vs-node--browser-extension"
      handles={[
        { id: `${id}-result`, type: 'source', side: 'right', top: '50%' },
        { id: `${id}-trigger`, type: 'source', side: 'right', top: '8%', label: '' },
      ]}
    >
      <button
        type="button"
        className="vs-node__side-btn"
        aria-label="Toggle browser extension details"
        onClick={() => setDetailsOpen((prev) => !prev)}
      >
        {detailsOpen ? '[]' : '>'}
      </button>

      <input
        className="vs-node__name-bar"
        type="text"
        value={name}
        onChange={handleNameChange}
        aria-label="Browser extension node name"
      />

      {detailsOpen ? (
        <section className="vs-node__notice">
          <p>
            <strong>Note:</strong> Please deploy the pipeline to show on chrome extension.
          </p>
          <p>
            The chrome extension node requires the{' '}
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noreferrer">
              VectorShift Chrome Extension
            </a>{' '}
            to function.
          </p>
        </section>
      ) : null}

      <label className="vs-node__toggle-row">
        <span>
          Show on VectorShift Chrome Extension
          <small aria-hidden="true"> i </small>
        </span>
        <input
          type="checkbox"
          checked={showOnExtension}
          onChange={handleToggleChange}
        />
      </label>
    </BaseNode>
  );
};
