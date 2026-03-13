// src/renderer/components/planet-editor/AtmosphereControls.tsx
interface Props {
  color: string;
  intensity: number;
  width: number;
  onColorChange: (c: string) => void;
  onIntensityChange: (i: number) => void;
  onWidthChange: (w: number) => void;
}

export function AtmosphereControls({ color, intensity, width, onColorChange, onIntensityChange, onWidthChange }: Props) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Atmosphere</h4>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={e => onColorChange(e.target.value)} className="w-8 h-8 rounded border border-[var(--sf-border)] cursor-pointer" />
          <input className="flex-1 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-2 py-1 text-xs text-[var(--sf-text-primary)] font-mono"
            value={color} onChange={e => onColorChange(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Intensity ({intensity.toFixed(1)})</label>
        <input type="range" min="0" max="2" step="0.1" value={intensity} onChange={e => onIntensityChange(Number(e.target.value))}
          className="w-full accent-[var(--sf-accent)]" />
      </div>
      <div>
        <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Width ({width.toFixed(1)})</label>
        <input type="range" min="0" max="1.5" step="0.05" value={width} onChange={e => onWidthChange(Number(e.target.value))}
          className="w-full accent-[var(--sf-accent)]" />
      </div>
    </div>
  );
}
