import { useState } from 'react';

const ICON_LIST = ['shield', 'sword', 'planet', 'star', 'ship', 'dna', 'flame', 'bolt', 'atom', 'moon', 'comet', 'orbit'];

const ICON_SYMBOLS: Record<string, string> = {
  shield: '🛡',
  sword: '⚔',
  planet: '🪐',
  star: '⭐',
  ship: '🚀',
  dna: '🧬',
  flame: '🔥',
  bolt: '⚡',
  atom: '⚛',
  moon: '🌙',
  comet: '☄',
  orbit: '🔭',
};

interface IconPickerProps {
  value?: string;
  onChange?: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filtered = ICON_LIST.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search icons..."
        className="
          w-full px-3 py-1.5 text-xs rounded-[var(--sf-radius-sm)]
          bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
          border border-[var(--sf-border)]
          placeholder:text-[var(--sf-text-muted)]
          focus:outline-none focus:border-[var(--sf-border-active)]
          transition-all duration-150
        "
      />
      <div className="grid grid-cols-6 gap-1.5">
        {filtered.map((icon) => (
          <button
            key={icon}
            title={icon}
            onClick={() => onChange?.(icon)}
            className={`
              flex flex-col items-center gap-0.5 p-2 rounded-[var(--sf-radius-sm)]
              text-lg transition-all duration-100
              ${value === icon
                ? 'bg-[var(--sf-accent-glow)] border border-[var(--sf-border-active)]'
                : 'hover:bg-[var(--sf-bg-card)] border border-transparent'
              }
            `}
          >
            <span>{ICON_SYMBOLS[icon] ?? icon[0].toUpperCase()}</span>
            <span className="text-[10px] text-[var(--sf-text-muted)] truncate w-full text-center">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
