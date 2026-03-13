// src/renderer/components/condition-builder/ComparisonBlock.tsx
// Visual component for comparison blocks (yellow).
// Primary rendering is handled by BlockNode inside ConditionBuilder.
// This component provides a standalone visual representation when needed.
import type { Block } from './conditionSerializer';

const OPERATORS = ['=', '>', '<', '>=', '<='] as const;

interface Props {
  block: Block;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Block>) => void;
}

export function ComparisonBlock({ block, onDelete, onUpdate }: Props) {
  return (
    <div
      className="rounded border-l-4"
      style={{ borderLeftColor: '#eab308' }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--sf-bg-card)] rounded-r">
        <span className="text-xs font-mono font-semibold text-[var(--sf-text-primary)]">
          {block.name}
        </span>
        <select
          className="bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded px-1 py-0.5 text-xs text-[var(--sf-text-primary)]"
          value={(block.params.operator as string) ?? '>='}
          onChange={e =>
            onUpdate(block.id, { params: { ...block.params, operator: e.target.value } })
          }
        >
          {OPERATORS.map(op => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <input
          className="w-16 bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded px-1 py-0.5 text-xs text-[var(--sf-text-primary)]"
          value={(block.params.value as string) ?? ''}
          onChange={e =>
            onUpdate(block.id, { params: { ...block.params, value: e.target.value } })
          }
        />
        <button
          className="ml-auto text-xs text-[var(--sf-text-muted)] hover:text-red-400"
          onClick={() => onDelete(block.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}
