// src/renderer/components/node-editor/OptionEdge.tsx
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export function OptionEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, style } = props;

  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });

  return (
    <>
      <BaseEdge path={edgePath} style={{ ...style, stroke: 'var(--sf-accent)', strokeWidth: 2 }} />
      {label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          className="text-[10px] fill-[var(--sf-text-muted)]"
        >
          {String(label)}
        </text>
      )}
    </>
  );
}
