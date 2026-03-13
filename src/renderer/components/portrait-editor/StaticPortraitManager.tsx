// src/renderer/components/portrait-editor/StaticPortraitManager.tsx
import { Button } from '../common/Button';

interface Portrait {
  id: string;
  name: string;
  path: string;
  thumbnail: string | null;
}

interface Props {
  portraits: Portrait[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function StaticPortraitManager({ portraits, onAdd, onRemove, onSelect, selectedId }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Static Portraits</h4>
        <Button variant="ghost" size="sm" onClick={onAdd}>+ Import</Button>
      </div>
      {portraits.length === 0 ? (
        <div className="text-xs text-[var(--sf-text-muted)] italic py-4 text-center">
          No portraits imported. Click Import to add PNG/JPG images.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {portraits.map(p => (
            <button key={p.id} onClick={() => onSelect(p.id)}
              className={`aspect-square rounded border-2 overflow-hidden transition-colors ${
                selectedId === p.id ? 'border-[var(--sf-accent)]' : 'border-[var(--sf-border)] hover:border-[var(--sf-text-muted)]'
              }`}
            >
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--sf-bg-card)] flex items-center justify-center text-xs text-[var(--sf-text-muted)]">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      {selectedId && (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onRemove(selectedId)}>Remove</Button>
        </div>
      )}
    </div>
  );
}
