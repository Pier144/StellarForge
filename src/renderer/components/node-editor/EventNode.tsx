// src/renderer/components/node-editor/EventNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface EventNodeData {
  eventId: string;
  title: string;
  type: 'country_event' | 'planet_event' | 'fleet_event' | 'ship_event' | 'pop_event' | 'observer_event';
  options: Array<{ id: string; name: string }>;
  isTriggeredOnly: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  country_event: '#3b82f6',
  planet_event: '#22c55e',
  fleet_event: '#f97316',
  ship_event: '#6366f1',
  pop_event: '#ec4899',
  observer_event: '#8b5cf6',
};

export function EventNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as EventNodeData;
  const color = TYPE_COLORS[nodeData.type] ?? '#6b7280';

  return (
    <div
      className={`rounded-lg border-2 bg-[var(--sf-bg-card)] shadow-lg min-w-[200px] ${selected ? 'ring-2 ring-[var(--sf-accent)]' : ''}`}
      style={{ borderColor: color }}
    >
      {/* Input handle */}
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[var(--sf-accent)]" />

      {/* Header */}
      <div className="px-3 py-2 rounded-t-lg" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded text-white font-bold" style={{ backgroundColor: color }}>
            {nodeData.type.replace('_event', '').toUpperCase()}
          </span>
          <span className="text-xs font-mono text-[var(--sf-text-primary)] truncate">{nodeData.eventId}</span>
        </div>
        <div className="text-sm text-[var(--sf-text-secondary)] mt-1 truncate">{nodeData.title || 'Untitled Event'}</div>
      </div>

      {/* Options */}
      <div className="px-3 py-2 space-y-1">
        {nodeData.options.length === 0 ? (
          <div className="text-[10px] text-[var(--sf-text-muted)] italic">No options</div>
        ) : (
          nodeData.options.map((opt, idx) => (
            <div key={opt.id} className="relative flex items-center justify-between text-xs text-[var(--sf-text-secondary)]">
              <span className="truncate pr-4">{idx + 1}. {opt.name || 'Option'}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={opt.id}
                className="!w-2.5 !h-2.5 !bg-[var(--sf-accent)] !right-[-11px]"
              />
            </div>
          ))
        )}
      </div>

      {/* Footer indicator */}
      {nodeData.isTriggeredOnly && (
        <div className="px-3 py-1 border-t border-[var(--sf-border)] text-[10px] text-[var(--sf-text-muted)]">
          Triggered only
        </div>
      )}
    </div>
  );
}
