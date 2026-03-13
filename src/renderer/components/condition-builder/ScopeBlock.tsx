// src/renderer/components/condition-builder/ScopeBlock.tsx
// Visual component for scope blocks (orange).
// Primary rendering is handled by BlockNode inside ConditionBuilder.
// This component provides a standalone visual representation when needed.
import type { Block } from './conditionSerializer';

interface Props {
  block: Block;
  onDelete: (id: string) => void;
  children?: React.ReactNode;
}

export function ScopeBlock({ block, onDelete, children }: Props) {
  return (
    <div
      className="rounded border-l-4"
      style={{ borderLeftColor: '#f97316' }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--sf-bg-card)] rounded-r">
        <span className="text-xs font-mono font-semibold text-[var(--sf-text-primary)]">
          {block.name}
        </span>
        <span className="text-[10px] text-[var(--sf-text-muted)] ml-1">scope</span>
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
