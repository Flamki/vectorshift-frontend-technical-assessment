import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';

const workflowTabs = ['Workflow', 'Interface', 'Analytics', 'Manager', 'Playground'];
const categoryTabs = ['Start', 'VectorShift', 'Knowledge', 'AI', 'Integrations', 'Logic', 'Data', 'Chat'];

const ToolbarIcon = ({ name }) => {
  if (name === 'input') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M8 12h8" />
        <path d="m12.5 8.5 3.5 3.5-3.5 3.5" />
      </svg>
    );
  }

  if (name === 'trigger') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4v7h7" />
        <path d="M20 20v-7h-7" />
        <path d="m4 11 5-5" />
        <path d="m20 13-5 5" />
      </svg>
    );
  }

  if (name === 'start') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5v15" />
        <path d="m7 5 10 4-10 4" />
      </svg>
    );
  }

  if (name === 'browser') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5v17" />
        <path d="M3.5 12h17" />
        <path d="m7 7 10 10" />
        <path d="m17 7-10 10" />
      </svg>
    );
  }

  if (name === 'output') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M16 12H8" />
        <path d="m11.5 8.5-3.5 3.5 3.5 3.5" />
      </svg>
    );
  }

  if (name === 'note') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4.5" width="16" height="15" rx="2.5" />
        <path d="M8 9h8" />
        <path d="M8 12h8" />
        <path d="M8 15h5" />
      </svg>
    );
  }

  if (name === 'group') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="4.5" width="6.5" height="6.5" rx="1.5" />
        <rect x="13" y="4.5" width="6.5" height="6.5" rx="1.5" />
        <rect x="4.5" y="13" width="6.5" height="6.5" rx="1.5" />
        <rect x="13" y="13" width="6.5" height="6.5" rx="1.5" />
      </svg>
    );
  }

  if (name === 'llm') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 10h8" />
        <path d="M8 14h5" />
      </svg>
    );
  }

  if (name === 'text') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16" />
        <path d="M12 6v12" />
        <path d="M8.5 18h7" />
      </svg>
    );
  }

  if (name === 'filter') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16l-6 7v5l-4 3V11L4 4Z" />
      </svg>
    );
  }

  if (name === 'math') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h6" />
        <path d="M5 16h6" />
        <path d="M17 6v12" />
        <path d="M14 9h6" />
        <path d="M14 14h6" />
      </svg>
    );
  }

  if (name === 'api') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v4" />
        <path d="M12 16v4" />
        <path d="M4 12h4" />
        <path d="M16 12h4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === 'delay') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  }

  if (name === 'merge') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4v6a2 2 0 0 0 2 2h8" />
        <path d="M6 20v-6a2 2 0 0 1 2-2h8" />
        <path d="m14 8 4 4-4 4" />
      </svg>
    );
  }

  return null;
};

const primaryToolbarNodes = [
  { type: 'customInput', label: 'Input', iconName: 'input' },
  { type: 'llm', label: 'LLM', iconName: 'llm' },
  { type: 'customOutput', label: 'Output', iconName: 'output' },
  { type: 'text', label: 'Text', iconName: 'text' },
  { type: 'filter', label: 'Filter', iconName: 'filter' },
  { type: 'math', label: 'Math', iconName: 'math' },
  { type: 'merge', label: 'Merge', iconName: 'merge' },
  { type: 'api', label: 'API', iconName: 'api' },
  { type: 'delay', label: 'Delay', iconName: 'delay' },
  { type: 'note', label: 'Note', iconName: 'note' },
];

export const PipelineToolbar = ({ isSubheaderCollapsed = false }) => {
  return (
    <section className="app-toolbar">
      <div className="workspace-header">
        <div className="workspace-crumbs">
          <span className="crumb-icon" aria-hidden="true" />
          <span>Projects</span>
          <span>/</span>
          <strong>New Project 1</strong>
          <span>/</span>
          <strong>New Workflow</strong>
        </div>

        <div className="workflow-strip" role="tablist" aria-label="Workflow Sections">
          {workflowTabs.map((tab, index) => (
            <button key={tab} type="button" className={`mode-tab ${index === 0 ? 'is-active' : ''}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="workspace-actions">
          <button type="button" className="ghost-btn">Ask Assistant</button>
          <button type="button" className="icon-btn" aria-label="Undo">&lt;</button>
          <button type="button" className="icon-btn" aria-label="Redo">&gt;</button>
          <button type="button" className="ghost-btn is-muted">Versions</button>
          <button type="button" className="icon-btn" aria-label="Code">&lt;/&gt;</button>
          <button type="button" className="icon-btn" aria-label="Close">x</button>
          <button type="button" className="ghost-btn">Share</button>
          <button type="button" className="run-btn">Run</button>
          <SubmitButton inline label="Save" className="save-btn" />
        </div>
      </div>

      {!isSubheaderCollapsed ? (
        <div className="node-browser">
          <div className="node-browser__content">
            <div className="node-browser__top">
              <div className="node-browser__search">
                <span className="search-glyph" aria-hidden="true" />
                <input type="text" value="Search Nodes" readOnly aria-label="Search Nodes" />
              </div>

              <div className="node-browser__tabs">
                {categoryTabs.map((tab, index) => (
                  <button key={tab} type="button" className={`category-tab ${index === 0 ? 'is-active' : ''}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="node-browser__cards">
              {primaryToolbarNodes.map((node) => (
                <DraggableNode
                  key={node.type || node.label}
                  type={node.type}
                  label={node.label}
                  icon={<ToolbarIcon name={node.iconName} />}
                  disabled={Boolean(node.disabled)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
