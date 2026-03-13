// src/renderer/components/planet-editor/CloudLayerEditor.tsx
interface Props {
  enabled: boolean;
  opacity: number;
  rotationSpeed: number;
  onEnabledChange: (e: boolean) => void;
  onOpacityChange: (o: number) => void;
  onRotationSpeedChange: (s: number) => void;
}

export function CloudLayerEditor({ enabled, opacity, rotationSpeed, onEnabledChange, onOpacityChange, onRotationSpeedChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Cloud Layer</h4>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={e => onEnabledChange(e.target.checked)} className="accent-[var(--sf-accent)]" />
          <span className="text-xs text-[var(--sf-text-muted)]">{enabled ? 'On' : 'Off'}</span>
        </label>
      </div>
      {enabled && (
        <>
          <div>
            <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Opacity ({opacity.toFixed(2)})</label>
            <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => onOpacityChange(Number(e.target.value))}
              className="w-full accent-[var(--sf-accent)]" />
          </div>
          <div>
            <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Rotation Speed ({rotationSpeed.toFixed(1)})</label>
            <input type="range" min="0" max="5" step="0.1" value={rotationSpeed} onChange={e => onRotationSpeedChange(Number(e.target.value))}
              className="w-full accent-[var(--sf-accent)]" />
          </div>
        </>
      )}
    </div>
  );
}
