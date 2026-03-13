// src/renderer/components/localisation/LanguageTable.tsx
import { useState, useMemo } from 'react';

export interface LocalisationEntry {
  key: string;
  translations: Record<string, string>;
}

const ALL_LANGUAGES = [
  'english', 'french', 'german', 'spanish', 'russian',
  'polish', 'braz_por', 'simp_chinese', 'japanese', 'korean', 'italian',
] as const;

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'EN', french: 'FR', german: 'DE', spanish: 'ES', russian: 'RU',
  polish: 'PL', braz_por: 'PT-BR', simp_chinese: 'ZH', japanese: 'JA', korean: 'KO', italian: 'IT',
};

interface Props {
  entries: LocalisationEntry[];
  visibleLanguages: string[];
  onEntryChange: (key: string, language: string, value: string) => void;
  searchQuery: string;
}

export function LanguageTable({ entries, visibleLanguages, onEntryChange, searchQuery }: Props) {
  const [sortBy, setSortBy] = useState<'key' | 'completion'>('key');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let result = entries;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.key.toLowerCase().includes(q) ||
        Object.values(e.translations).some(t => t.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'key') {
        return sortAsc ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key);
      }
      // Sort by completion
      const aCount = visibleLanguages.filter(l => a.translations[l]?.trim()).length;
      const bCount = visibleLanguages.filter(l => b.translations[l]?.trim()).length;
      return sortAsc ? aCount - bCount : bCount - aCount;
    });

    return result;
  }, [entries, searchQuery, sortBy, sortAsc, visibleLanguages]);

  const toggleSort = (col: 'key' | 'completion') => {
    if (sortBy === col) setSortAsc(!sortAsc);
    else { setSortBy(col); setSortAsc(true); }
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--sf-border)]">
            <th className="text-left px-3 py-2 text-xs text-[var(--sf-text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--sf-text-secondary)]"
              onClick={() => toggleSort('key')}>
              Key {sortBy === 'key' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            {visibleLanguages.map(lang => (
              <th key={lang} className="text-left px-3 py-2 text-xs text-[var(--sf-text-muted)] uppercase tracking-wider min-w-[200px]">
                {LANGUAGE_LABELS[lang] ?? lang}
              </th>
            ))}
            <th className="text-left px-3 py-2 text-xs text-[var(--sf-text-muted)] cursor-pointer hover:text-[var(--sf-text-secondary)]"
              onClick={() => toggleSort('completion')}>
              % {sortBy === 'completion' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(entry => {
            const filled = visibleLanguages.filter(l => entry.translations[l]?.trim()).length;
            const pct = visibleLanguages.length > 0 ? Math.round((filled / visibleLanguages.length) * 100) : 0;

            return (
              <tr key={entry.key} className="border-b border-[var(--sf-border)] hover:bg-[var(--sf-bg-card)]">
                <td className="px-3 py-1.5 font-mono text-xs text-[var(--sf-text-primary)]">{entry.key}</td>
                {visibleLanguages.map(lang => {
                  const val = entry.translations[lang] ?? '';
                  const missing = !val.trim();
                  return (
                    <td key={lang} className="px-1 py-0.5">
                      <input
                        className={`w-full px-2 py-1 text-xs rounded border transition-colors ${
                          missing
                            ? 'bg-yellow-500/10 border-yellow-500/30 text-[var(--sf-text-primary)]'
                            : 'bg-[var(--sf-bg-card)] border-[var(--sf-border)] text-[var(--sf-text-primary)]'
                        } focus:border-[var(--sf-accent)] focus:outline-none`}
                        value={val}
                        onChange={e => onEntryChange(entry.key, lang, e.target.value)}
                        placeholder={`[${LANGUAGE_LABELS[lang]}]`}
                      />
                    </td>
                  );
                })}
                <td className="px-3 py-1.5 text-xs text-[var(--sf-text-muted)]">
                  <span className={pct === 100 ? 'text-green-400' : pct > 0 ? 'text-yellow-400' : 'text-red-400'}>
                    {pct}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
