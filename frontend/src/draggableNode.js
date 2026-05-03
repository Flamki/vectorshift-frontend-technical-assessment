export const DraggableNode = ({ type, label, subtitle, icon, disabled = false }) => {
  const onDragStart = (event, nodeType) => {
    if (disabled || !nodeType) {
      return;
    }

    const appData = { nodeType };
    event.currentTarget.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <button
      type="button"
      className={`draggable-node ${disabled ? 'is-disabled' : ''}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => {
        event.currentTarget.style.cursor = disabled ? 'not-allowed' : 'grab';
      }}
      draggable={!disabled}
      disabled={disabled}
    >
      {icon ? <span className="draggable-node__icon">{icon}</span> : null}
      <span className="draggable-node__title">
        {String(label)
          .split('\n')
          .map((line, index) => (
            <span key={`${label}-${index}`} className="draggable-node__line">
              {line}
            </span>
          ))}
      </span>
      {subtitle ? <span className="draggable-node__subtitle">{subtitle}</span> : null}
    </button>
  );
};
