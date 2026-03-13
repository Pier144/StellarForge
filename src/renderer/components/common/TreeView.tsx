import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';

export interface TreeItem {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeItem[];
}

interface TreeNodeProps {
  item: TreeItem;
  depth: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

function TreeNode({ item, depth, selectedId, onSelect }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = item.id === selectedId;

  return (
    <div>
      <div
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          onSelect?.(item.id);
        }}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className={`
          flex items-center gap-1.5 py-1.5 pr-3 text-sm cursor-pointer rounded-[var(--sf-radius-sm)]
          transition-colors duration-100
          ${isSelected
            ? 'bg-[var(--sf-accent-glow)] text-[var(--sf-text-primary)]'
            : 'text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)] hover:bg-[var(--sf-bg-card)]'
          }
        `}
      >
        <span
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
        >
          {hasChildren && (
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 m-0.5">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className="truncate">{item.label}</span>
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TreeViewProps {
  items: TreeItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function TreeView({ items, selectedId, onSelect }: TreeViewProps) {
  return (
    <div className="py-1">
      {items.map((item) => (
        <TreeNode key={item.id} item={item} depth={0} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
