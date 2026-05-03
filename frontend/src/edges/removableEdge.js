import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { useStore } from '../store';

export const RemovableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  selected,
}) => {
  const removeEdgeById = useStore((state) => state.removeEdgeById);
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleRemove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeEdgeById(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <path
        d={edgePath}
        className="vs-removable-edge__hitbox"
        fill="none"
        stroke="transparent"
        strokeWidth={22}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          className={`vs-removable-edge__button ${
            selected || isHovered ? 'is-visible' : ''
          }`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={handleRemove}
          aria-label="Disconnect edge"
          title="Disconnect edge"
        >
          ×
        </button>
      </EdgeLabelRenderer>
    </>
  );
};
