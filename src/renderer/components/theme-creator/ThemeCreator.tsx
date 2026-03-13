// src/renderer/components/theme-creator/ThemeCreator.tsx
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { ThemePreview } from './ThemePreview';
import { Button } from '../common/Button';

interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  border: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
}

interface SavedTheme {
  id: string;
  name: string;
  colors: ThemeColors;
}

const DEFAULT_COLORS: ThemeColors = {
  bgPrimary: '#0f0f1a',
  bgSecondary: '#151528',
  bgCard: '#1a1a35',
  border: '#2a2a4a',
  accent: '#6366f1',
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

const COLOR_GROUPS = [
  { label: 'Backgrounds', keys: ['bgPrimary', 'bgSecondary', 'bgCard'] as const },
  { label: 'Text', keys: ['textPrimary', 'textSecondary', 'textMuted'] as const },
  { label: 'Accent & Status', keys: ['accent', 'border', 'success', 'warning', 'error'] as const },
];

const PRETTY_LABELS: Record<string, string> = {
  bgPrimary: 'Primary Background',
  bgSecondary: 'Secondary Background',
  bgCard: 'Card Background',
  border: 'Border',
  accent: 'Accent',
  textPrimary: 'Primary Text',
  textSecondary: 'Secondary Text',
  textMuted: 'Muted Text',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

export function ThemeCreator() {
  const [colors, setColors] = useState<ThemeColors>({ ...DEFAULT_COLORS });
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [themeName, setThemeName] = useState('My Custom Theme');

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const id = `custom_${Date.now()}`;
    setSavedThemes(prev => [...prev, { id, name: themeName, colors: { ...colors } }]);
  };

  const handleLoad = (theme: SavedTheme) => {
    setColors({ ...theme.colors });
    setThemeName(theme.name);
  };

  const handleExport = () => {
    const json = JSON.stringify({ name: themeName, colors }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    const root = document.documentElement;
    root.style.setProperty('--sf-bg-primary', colors.bgPrimary);
    root.style.setProperty('--sf-bg-secondary', colors.bgSecondary);
    root.style.setProperty('--sf-bg-card', colors.bgCard);
    root.style.setProperty('--sf-border', colors.border);
    root.style.setProperty('--sf-accent', colors.accent);
    root.style.setProperty('--sf-text-primary', colors.textPrimary);
    root.style.setProperty('--sf-text-secondary', colors.textSecondary);
    root.style.setProperty('--sf-text-muted', colors.textMuted);
    root.style.setProperty('--sf-success', colors.success);
    root.style.setProperty('--sf-warning', colors.warning);
    root.style.setProperty('--sf-error', colors.error);
  };

  return (
    <div className="flex h-full">
      {/* Saved themes list */}
      <div className="w-48 border-r border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] p-3 space-y-2 overflow-y-auto">
        <h3 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Saved Themes</h3>
        {savedThemes.length === 0 && (
          <p className="text-[10px] text-[var(--sf-text-muted)] italic">No saved themes yet</p>
        )}
        {savedThemes.map(theme => (
          <button key={theme.id} onClick={() => handleLoad(theme)}
            className="w-full text-left px-2 py-1.5 rounded text-xs text-[var(--sf-text-secondary)] hover:bg-[var(--sf-bg-card)] transition-colors">
            <div className="flex gap-1 mb-1">
              {[theme.colors.bgPrimary, theme.colors.accent, theme.colors.textPrimary].map((c, i) => (
                <div key={i} className="w-3 h-3 rounded-full border border-[var(--sf-border)]" style={{ backgroundColor: c }}></div>
              ))}
            </div>
            {theme.name}
          </button>
        ))}
      </div>

      {/* Color pickers */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Theme Name</label>
          <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]"
            value={themeName} onChange={e => setThemeName(e.target.value)} />
        </div>

        {COLOR_GROUPS.map(group => (
          <div key={group.label}>
            <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider mb-2">{group.label}</h4>
            <div className="space-y-2">
              {group.keys.map(key => (
                <ColorPicker key={key} label={PRETTY_LABELS[key]} value={colors[key]} onChange={v => updateColor(key, v)} />
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Button variant="primary" onClick={handleApply}>Apply</Button>
          <Button variant="secondary" onClick={handleSave}>Save</Button>
          <Button variant="ghost" onClick={handleExport}>Export JSON</Button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-80 border-l border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] p-4 flex flex-col items-center gap-4">
        <h3 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Live Preview</h3>
        <ThemePreview colors={colors} />
      </div>
    </div>
  );
}
