import { useState, useMemo, useRef, useEffect } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

const INPUT_TYPES = [
  'Text',
  'File',
  'List of files',
  'List of lists of files',
  'Audio',
  'Image',
  'Knowledge Base',
  'Agent',
  'Table',
];

const NAME_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const validateName = (name) => {
  if (!name || name.length < 3 || name.length > 50 || !NAME_REGEX.test(name)) {
    return 'Name must be 3\u201350 characters long and can only contain letters, numbers, and underscores. Must start with a letter or underscore.';
  }
  return null;
};

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const [showSettings, setShowSettings] = useState(false);
  const [description, setDescription] = useState(data?.description || '');
  const [useDefaultValue, setUseDefaultValue] = useState(data?.useDefaultValue || false);
  const settingsRef = useRef(null);

  const nameError = useMemo(() => validateName(currName), [currName]);

  /* close settings on outside click */
  useEffect(() => {
    if (!showSettings) return;
    const close = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showSettings]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'inputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, 'inputType', e.target.value);
  };

  const handleDescChange = (e) => {
    setDescription(e.target.value);
    updateNodeField(id, 'description', e.target.value);
  };

  const toggleDefault = () => {
    const next = !useDefaultValue;
    setUseDefaultValue(next);
    updateNodeField(id, 'useDefaultValue', next);
  };

  return (
    <BaseNode
      nodeId={id}
      title="Input"
      subtitle="Pass data of different types into your workflow"
      icon="input"
      className="vs-node--input"
      onSettingsClick={() => setShowSettings((v) => !v)}
      handles={[{ id: `${id}-value`, type: 'source', side: 'right', top: '50%' }]}
    >
      {/* ── Editable name bar ── */}
      <input
        type="text"
        className={`vs-node__name-bar nodrag nopan ${nameError ? 'is-invalid' : ''}`}
        value={currName}
        onChange={handleNameChange}
      />

      {/* ── Validation error ── */}
      {nameError ? (
        <div className="vs-input__error">{nameError}</div>
      ) : null}

      {/* ── Suggestion notice ── */}
      <div className="vs-input__suggestion">
        <span className="vs-input__suggestion-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 21h6" />
            <path d="M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3Z" />
          </svg>
        </span>
        <p><strong>Suggestion:</strong> Give the node a distinct name</p>
      </div>

      {/* ── Type selector ── */}
      <div className="vs-input__type-section nodrag nopan">
        <div className="vs-input__type-header">
          <span className="vs-input__type-label">
            Type <small className="vs-node__info-icon">ⓘ</small>
          </span>
          <span className="vs-input__type-badge">Dropdown</span>
        </div>
        <div className="vs-input__select-wrap">
          <select className="nodrag nopan" value={inputType} onChange={handleTypeChange}>
            {INPUT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="vs-input__chevron" aria-hidden="true">
            <svg viewBox="0 0 20 20"><path d="M5 7.5l5 5 5-5" /></svg>
          </span>
        </div>
      </div>

      {/* ── Settings panel (floating) ── */}
      {showSettings ? (
        <div className="vs-input__settings nodrag nopan" ref={settingsRef}>
          <div className="vs-input__settings-head">
            <h5>Settings</h5>
            <button type="button" onClick={() => setShowSettings(false)}>×</button>
          </div>

          <div className="vs-input__settings-field">
            <div className="vs-input__settings-label">
              <span>Description <small className="vs-node__info-icon">ⓘ</small></span>
              <div className="vs-input__settings-tools">
                <button type="button" aria-label="AI suggest">
                  <svg viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="3" /><path d="M7 8h6" /><path d="M7 12h4" /></svg>
                </button>
                <button type="button" aria-label="Add">+</button>
                <button type="button" aria-label="Expand">↗</button>
                <span className="vs-input__text-pill">Text</span>
              </div>
            </div>
            <textarea
              className="nodrag nopan"
              placeholder="Enter a description for this input"
              value={description}
              onChange={handleDescChange}
              rows={2}
            />
          </div>

          <div className="vs-node__toggle-row">
            <span>Use Default Value <small className="vs-node__info-icon">ⓘ</small></span>
            <input className="nodrag nopan" type="checkbox" checked={useDefaultValue} onChange={toggleDefault} />
          </div>
        </div>
      ) : null}

      {/* ── Side doc button ── */}
      <button type="button" className="vs-node__side-btn nodrag" aria-label="Documentation">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h3" />
        </svg>
      </button>
    </BaseNode>
  );
};
