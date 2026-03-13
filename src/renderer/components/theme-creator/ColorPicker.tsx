// src/renderer/components/theme-creator/ColorPicker.tsx
interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-7 h-7 rounded border border-[var(--sf-border)] cursor-pointer flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[var(--sf-text-muted)] truncate">{label}</div>
        <input className="w-full bg-transparent text-xs text-[var(--sf-text-primary)] font-mono border-none outline-none"
          value={value} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  );
}
