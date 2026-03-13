// src/renderer/components/portrait-editor/AnimatedPortraitDefs.tsx

interface AnimatedDef {
  entityName: string;
  meshFile: string;
  idleAnim: string;
  talkAnim: string;
  clothesSlots: string[];
  hairSlots: string[];
}

interface Props {
  definition: AnimatedDef;
  onChange: (def: AnimatedDef) => void;
}

export function AnimatedPortraitDefs({ definition, onChange }: Props) {
  const update = (key: keyof AnimatedDef, value: unknown) => {
    onChange({ ...definition, [key]: value });
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Animated Portrait</h4>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Entity Name (.asset)</label>
        <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
          value={definition.entityName} onChange={e => update('entityName', e.target.value)} placeholder="human_female_entity" />
      </div>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Mesh File</label>
        <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
          value={definition.meshFile} onChange={e => update('meshFile', e.target.value)} placeholder="gfx/models/portraits/..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Idle Animation</label>
          <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
            value={definition.idleAnim} onChange={e => update('idleAnim', e.target.value)} placeholder="idle" />
        </div>
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Talk Animation</label>
          <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
            value={definition.talkAnim} onChange={e => update('talkAnim', e.target.value)} placeholder="talking" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Clothes Slots (comma-separated)</label>
        <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
          value={definition.clothesSlots.join(', ')} onChange={e => update('clothesSlots', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="outfit_01, outfit_02" />
      </div>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Hair Slots (comma-separated)</label>
        <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
          value={definition.hairSlots.join(', ')} onChange={e => update('hairSlots', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="hair_01, hair_02" />
      </div>
    </div>
  );
}
