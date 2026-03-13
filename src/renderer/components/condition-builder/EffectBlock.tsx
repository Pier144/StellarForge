// src/renderer/components/condition-builder/EffectBlock.tsx
// Visual component for effect blocks (green).
// Primary rendering is handled by BlockNode inside ConditionBuilder.
// This component provides a standalone visual representation when needed.
import type { Block } from './conditionSerializer';

interface Props {
  block: Block;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  children?: React.ReactNode;
}

export function EffectBlock({ block, onDelete, onUpdate, children }: Props) {
  return (
    <div
      className="rounded border-l-4"
      style={{ borderLeftColor: '#22c55e' }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--sf-bg-card)] rounded-r">
        <span className="text-xs font-mono font-semibold text-[var(--sf-text-primary)]">
          {block.name}
        </span>
        {block.children.length === 0 && (
          <input
            className="flex-1 bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded px-1 py-0.5 text-xs text-[var(--sf-text-primary)]"
            placeholder="value"
            value={(block.params.value as string) ?? ''}
            onChange={e =>
              onUpdate(block.id, { params: { ...block.params, value: e.target.value } })
            }
          />
        )}
        <button
          className="ml-auto text-xs text-[var(--sf-text-muted)] hover:text-red-400"
          onClick={() => onDelete(block.id)}
        >
          ×
        </button>
      </div>
      {children && <div className="ml-4 mt-1 space-y-1 pb-1">{children}</div>}
    </div>
  );
}
