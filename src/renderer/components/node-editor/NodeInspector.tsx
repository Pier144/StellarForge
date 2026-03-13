// src/renderer/components/node-editor/NodeInspector.tsx
import { GenericEditor } from '../editors/GenericEditor';
import { eventSchema } from '@shared/schemas/eventSchema';
import { Button } from '../common/Button';
import type { EventNodeData } from './EventNode';

interface Props {
  nodeData: EventNodeData;
  item: Record<string, unknown>;
  onChange: (item: Record<string, unknown>) => void;
  onAddOption: () => void;
  onRemoveOption: (optId: string) => void;
  onClose: () => void;
}

export function NodeInspector({ nodeData, item, onChange, onAddOption, onRemoveOption, onClose }: Props) {
  return (
    <div className="w-80 border-l border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--sf-border)]">
        <span className="text-sm font-semibold text-[var(--sf-text-primary)]">{nodeData.eventId || 'Event'}</span>
        <button onClick={onClose} className="text-[var(--sf-text-muted)] hover:text-[var(--sf-text-primary)]">×</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <GenericEditor schema={eventSchema} item={item} onChange={onChange} />

        {/* Options management */}
        <div className="px-4 py-3 border-t border-[var(--sf-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase">Options</span>
            <Button variant="ghost" size="sm" onClick={onAddOption}>+ Add</Button>
          </div>
          <div className="space-y-1">
            {nodeData.options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center justify-between px-2 py-1.5 bg-[var(--sf-bg-card)] rounded text-xs">
                <span className="text-[var(--sf-text-secondary)]">{idx + 1}. {opt.name || 'Option'}</span>
                <button onClick={() => onRemoveOption(opt.id)} className="text-[var(--sf-text-muted)] hover:text-red-400">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
