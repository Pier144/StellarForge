// src/renderer/components/condition-builder/LogicBlock.tsx
// Visual component for logic blocks (gray) — AND/OR/NOT/NOR/NAND.
// Primary rendering is handled by BlockNode inside ConditionBuilder.
// This component provides a standalone visual representation when needed.
import type { Block } from './conditionSerializer';

interface Props {
  block: Block;
  onDelete: (id: string) => void;
  children?: React.ReactNode;
}

const LOGIC_DESCRIPTIONS: Record<string, string> = {
  AND: 'All must be true',
  OR: 'Any must be true',
  NOT: 'Must not be true',
  NOR: 'None must be true',
  NAND: 'Not all true',
};

export function LogicBlock({ block, onDelete, children }: Props) {
  return (
    <div
      className="rounded border-l-4"
      style={{ borderLeftColor: '#6b7280' }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--sf-bg-card)] rounded-r">
        <span className="text-xs font-mono font-semibold text-[var(--sf-text-primary)]">
          {block.name}
        </span>
        <span className="text-[10px] text-[var(--sf-text-muted)] ml-1">
          {LOGIC_DESCRIPTIONS[block.name] ?? 'logic'}
        </span>
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
