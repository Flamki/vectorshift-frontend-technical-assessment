import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import './nodes.css';

const toPosition = (side) => (side === 'right' ? Position.Right : Position.Left);

const normalizeTop = (top) => {
  if (typeof top === 'number') {
    return `${top}%`;
  }
  return top;
};

const NodeHandle = ({ handle }) => {
  const top = normalizeTop(handle.top);
  const side = handle.side || 'left';

  return (
    <>
      <Handle
        id={handle.id}
        type={handle.type}
        position={toPosition(side)}
        style={top ? { top } : undefined}
        className="vs-node__handle"
      />
      {handle.label ? (
        <div
          className={`vs-node__handle-label ${side === 'right' ? 'is-right' : 'is-left'}`}
          style={top ? { top } : undefined}
        >
          {handle.label}
        </div>
      ) : null}
    </>
  );
};

const NodeGlyph = ({ icon }) => {
  if (icon === 'browser') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5v17" />
        <path d="M3.5 12h17" />
        <path d="m7 7 10 10" />
        <path d="m17 7-10 10" />
      </svg>
    );
  }

  if (icon === 'output') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M16 12H8" />
        <path d="m11.5 8.5-3.5 3.5 3.5 3.5" />
      </svg>
    );
  }

  if (icon === 'input') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M8 12h8" />
        <path d="m12.5 8.5 3.5 3.5-3.5 3.5" />
      </svg>
    );
  }

  if (icon === 'math') {
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

  if (icon === 'text') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16" />
        <path d="M12 6v12" />
        <path d="M8.5 18h7" />
      </svg>
    );
  }

  if (icon === 'note') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4.5" width="16" height="15" rx="2.5" />
        <path d="M8 9h8" />
        <path d="M8 12h8" />
        <path d="M8 15h5" />
      </svg>
    );
  }

  if (icon === 'merge') {
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

const NodeActionIcon = ({ type }) => {
  if (type === 'expand') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3.5H3.5V8" />
        <path d="m3.5 3.5 6 6" />
        <path d="M16 20.5h4.5V16" />
        <path d="m20.5 20.5-6-6" />
      </svg>
    );
  }
  if (type === 'settings') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z" />
        <path d="m19.4 13 .1-2-2-.5a6.2 6.2 0 0 0-.7-1.7l1.1-1.8-1.4-1.4-1.8 1.1a6.2 6.2 0 0 0-1.7-.7l-.5-2h-2l-.5 2a6.2 6.2 0 0 0-1.7.7L6 5.6 4.6 7l1.1 1.8a6.2 6.2 0 0 0-.7 1.7l-2 .5.1 2 2 .5a6.2 6.2 0 0 0 .7 1.7L4.6 17l1.4 1.4 1.8-1.1a6.2 6.2 0 0 0 1.7.7l.5 2h2l.5-2a6.2 6.2 0 0 0 1.7-.7l1.8 1.1 1.4-1.4-1.1-1.8c.3-.5.5-1.1.7-1.7l2-.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10" />
      <path d="M17 7 7 17" />
    </svg>
  );
};

export const BaseNode = ({
  nodeId,
  title,
  subtitle,
  icon = 'text',
  handles = [],
  children,
  style,
  className = '',
  onSettingsClick,
  onExpandClick,
}) => {
  const removeNode = useStore((state) => state.removeNode);

  return (
    <div className={`vs-node ${className}`.trim()} style={style}>
      {handles.map((handle) => (
        <NodeHandle key={handle.id} handle={handle} />
      ))}

      <header className="vs-node__header">
        <div className="vs-node__title-row">
          <div className="vs-node__title-block">
            <span className="vs-node__title-icon" aria-hidden="true">
              <NodeGlyph icon={icon} />
            </span>
            <h4>{title}</h4>
          </div>
          <div className="vs-node__actions" aria-label="Node Actions">
            <button type="button" className="vs-node__action-btn" aria-label="Expand node" onClick={onExpandClick}>
              <NodeActionIcon type="expand" />
            </button>
            <button type="button" className="vs-node__action-btn" aria-label="Node settings" onClick={onSettingsClick}>
              <NodeActionIcon type="settings" />
            </button>
            <button
              type="button"
              className="vs-node__action-btn"
              aria-label="Remove node"
              onClick={() => removeNode(nodeId)}
            >
              <NodeActionIcon type="close" />
            </button>
          </div>
        </div>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>

      <div className="vs-node__content nodrag">{children}</div>
    </div>
  );
};

export const Field = ({ label, children }) => {
  return (
    <label className="vs-node__field">
      <span>{label}</span>
      {children}
    </label>
  );
};
