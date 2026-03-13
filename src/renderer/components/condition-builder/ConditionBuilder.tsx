// src/renderer/components/condition-builder/ConditionBuilder.tsx
import { useState, useCallback } from 'react';
import { BlockPalette } from './BlockPalette';
import { serializeBlocks, Block, BlockType } from './conditionSerializer';

interface Props {
  mode: 'trigger' | 'effect';
  value: Block[];
  onChange: (blocks: Block[]) => void;
}

// Color mapping for block borders
const BLOCK_COLORS: Record<BlockType, string> = {
  trigger: '#3b82f6',
  effect: '#22c55e',
  logic: '#6b7280',
  scope: '#f97316',
  comparison: '#eab308',
};

let idCounter = 0;
function genId() {
  return `block_${++idCounter}_${Date.now()}`;
}

export function ConditionBuilder({ mode, value, onChange }: Props) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = useCallback(
    (name: string, type: BlockType) => {
      const newBlock: Block = { id: genId(), type, name, params: {}, children: [] };
      if (type === 'comparison') {
        newBlock.params = { operator: '>=', value: 0 };
      }
      if (selectedBlockId) {
        // Add as child of selected block
        const updated = addChildToBlock(value, selectedBlockId, newBlock);
        onChange(updated);
      } else {
        onChange([...value, newBlock]);
      }
    },
    [value, onChange, selectedBlockId]
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      onChange(removeBlock(value, blockId));
      if (selectedBlockId === blockId) setSelectedBlockId(null);
    },
    [value, onChange, selectedBlockId]
  );

  const updateBlock = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      onChange(updateBlockInTree(value, blockId, updates));
    },
    [value, onChange]
  );

  return (
    <div
      className="flex border border-[var(--sf-border)] rounded-lg overflow-hidden"
      style={{ height: 400 }}
    >
      <BlockPalette onAdd={addBlock} mode={mode} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-4 bg-[var(--sf-bg-primary)]">
          {value.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-[var(--sf-text-muted)]">
              Click a block from the palette to add it
            </div>
          ) : (
            <div className="space-y-2">
              {value.map(block => (
                <BlockNode
                  key={block.id}
                  block={block}
                  selectedId={selectedBlockId}
                  onSelect={setSelectedBlockId}
                  onDelete={deleteBlock}
                  onUpdate={updateBlock}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
        {/* Code preview */}
        <div className="h-32 border-t border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] overflow-auto">
          <pre className="p-2 text-xs font-mono text-[var(--sf-text-secondary)] whitespace-pre">
            {serializeBlocks(value)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function BlockNode({
  block,
  selectedId,
  onSelect,
  onDelete,
  onUpdate,
  depth,
}: {
  block: Block;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  depth: number;
}) {
  const isSelected = selectedId === block.id;
  const canHaveChildren =
    block.type === 'logic' ||
    block.type === 'scope' ||
    ((block.type === 'trigger' || block.type === 'effect') && block.children.length > 0);

  return (
    <div
      className={`rounded border-l-4 ${isSelected ? 'ring-2 ring-[var(--sf-accent)]' : ''}`}
      style={{ borderLeftColor: BLOCK_COLORS[block.type], marginLeft: depth * 16 }}
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--sf-bg-card)] cursor-pointer hover:bg-[var(--sf-bg-secondary)] transition-colors rounded-r"
        onClick={() => onSelect(isSelected ? null : block.id)}
      >
        <span className="text-xs font-mono font-semibold text-[var(--sf-text-primary)]">
          {block.name}
        </span>

        {/* Inline params for comparison blocks */}
        {block.type === 'comparison' && (
          <>
            <select
              className="bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded px-1 py-0.5 text-xs text-[var(--sf-text-primary)]"
              value={(block.params.operator as string) ?? '>='}
              onChange={e =>
                onUpdate(block.id, { params: { ...block.params, operator: e.target.value } })
              }
              onClick={e => e.stopPropagation()}
            >
              <option value="=">=</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&gt;=</option>
              <option value="<=">&lt;=</option>
            </select>
            <input
              className="w-16 bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded px-1 py-0.5 text-xs text-[var(--sf-text-primary)]"
              value={(block.params.value as string) ?? ''}
              onChange={e =>
                onUpdate(block.id, { params: { ...block.params, value: e.target.value } })
              }
              onClick={e => e.stopPropagation()}
            />
          </>
        )}

        {/* Value input for simple trigger/effect blocks */}
        {(block.type === 'trigger' || block.type === 'effect') &&
          block.children.length === 0 && (
            <input
              className="flex-1 bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded px-1 py-0.5 text-xs text-[var(--sf-text-primary)]"
              placeholder="value"
              value={(block.params.value as string) ?? ''}
              onChange={e =>
                onUpdate(block.id, { params: { ...block.params, value: e.target.value } })
              }
              onClick={e => e.stopPropagation()}
            />
          )}

        {/* Type badge for scope and logic blocks */}
        {(block.type === 'scope' || block.type === 'logic') && (
          <span className="text-[10px] text-[var(--sf-text-muted)] ml-1">{block.type}</span>
        )}

        <button
          className="ml-auto text-xs text-[var(--sf-text-muted)] hover:text-red-400"
          onClick={e => {
            e.stopPropagation();
            onDelete(block.id);
          }}
        >
          ×
        </button>
      </div>

      {/* Children area */}
      {(canHaveChildren || block.children.length > 0) && (
        <div className="ml-4 mt-1 space-y-1 pb-1">
          {block.children.map(child => (
            <BlockNode
              key={child.id}
              block={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={childId => {
                const newChildren = removeBlock(block.children, childId);
                onUpdate(block.id, { children: newChildren });
              }}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions for immutable tree operations
function addChildToBlock(blocks: Block[], parentId: string, child: Block): Block[] {
  return blocks.map(b => {
    if (b.id === parentId) {
      return { ...b, children: [...b.children, child] };
    }
    if (b.children.length > 0) {
      return { ...b, children: addChildToBlock(b.children, parentId, child) };
    }
    return b;
  });
}

function removeBlock(blocks: Block[], blockId: string): Block[] {
  return blocks
    .filter(b => b.id !== blockId)
    .map(b => ({
      ...b,
      children: removeBlock(b.children, blockId),
    }));
}

function updateBlockInTree(blocks: Block[], blockId: string, updates: Partial<Block>): Block[] {
  return blocks.map(b => {
    if (b.id === blockId) {
      return { ...b, ...updates };
    }
    if (b.children.length > 0) {
      return { ...b, children: updateBlockInTree(b.children, blockId, updates) };
    }
    return b;
  });
}
