// src/renderer/components/localisation/LocalisationEditor.tsx
import { useState, useCallback } from 'react';
import { LanguageTable, type LocalisationEntry } from './LanguageTable';
import { Button } from '../common/Button';

const ALL_LANGUAGES = [
  'english', 'french', 'german', 'spanish', 'russian',
  'polish', 'braz_por', 'simp_chinese', 'japanese', 'korean', 'italian',
];

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English', french: 'French', german: 'German', spanish: 'Spanish',
  russian: 'Russian', polish: 'Polish', braz_por: 'BR Portuguese',
  simp_chinese: 'Chinese', japanese: 'Japanese', korean: 'Korean', italian: 'Italian',
};

interface Props {
  entries: LocalisationEntry[];
  onChange: (entries: LocalisationEntry[]) => void;
}

export function LocalisationEditor({ entries, onChange }: Props) {
  const [search, setSearch] = useState('');
  const [visibleLangs, setVisibleLangs] = useState<string[]>(['english', 'italian']);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleEntryChange = useCallback((key: string, language: string, value: string) => {
    onChange(entries.map(e => {
      if (e.key !== key) return e;
      return { ...e, translations: { ...e.translations, [language]: value } };
    }));
  }, [entries, onChange]);

  const handleAddKey = useCallback(() => {
    const key = `new_key_${Date.now()}`;
    onChange([...entries, { key, translations: {} }]);
  }, [entries, onChange]);

  const toggleLanguage = (lang: string) => {
    setVisibleLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 border-b border-[var(--sf-border)] bg-[var(--sf-bg-secondary)]">
        <input
          className="flex-1 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-1.5 text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)]"
          placeholder="Search keys or translations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button variant="primary" size="sm" onClick={handleAddKey}>+ Add Key</Button>
        <div className="relative">
          <Button variant="secondary" size="sm" onClick={() => setShowLangPicker(!showLangPicker)}>
            Languages ({visibleLangs.length})
          </Button>
          {showLangPicker && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded-lg shadow-xl z-20 p-2">
              {ALL_LANGUAGES.map(lang => (
                <label key={lang} className="flex items-center gap-2 px-2 py-1 text-xs text-[var(--sf-text-secondary)] cursor-pointer hover:bg-[var(--sf-bg-secondary)] rounded">
                  <input type="checkbox" checked={visibleLangs.includes(lang)} onChange={() => toggleLanguage(lang)}
                    className="accent-[var(--sf-accent)]" />
                  {LANGUAGE_LABELS[lang]}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <LanguageTable
          entries={entries}
          visibleLanguages={visibleLangs}
          onEntryChange={handleEntryChange}
          searchQuery={search}
        />
      </div>

      {/* Status bar */}
      <div className="px-4 py-1.5 border-t border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] text-[10px] text-[var(--sf-text-muted)]">
        {entries.length} keys · {visibleLangs.length} languages visible
      </div>
    </div>
  );
}
