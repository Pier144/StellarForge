// src/renderer/components/settings/SettingsView.tsx
import { useUiStore } from '../../stores/uiStore';
import { GamePathSelector } from './GamePathSelector';
import { useTranslation } from 'react-i18next';
import type { ThemeId } from '../../themes/theme-engine';

const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'sci-fi', label: 'Sci-Fi Immersive' },
  { id: 'glassmorphism', label: 'Glassmorphism' },
  { id: 'minimal-dark', label: 'Minimal Dark' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'warm-carbon', label: 'Warm Carbon' },
];

export function SettingsView() {
  const { theme, setTheme, language, setLanguage, codePanelVisible, toggleCodePanel } = useUiStore();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h2 className="text-xl font-bold text-[var(--sf-text-primary)]" style={{ fontFamily: 'var(--sf-font-display)' }}>{t('settings.title')}</h2>
      <section><h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-3">{t('settings.gamePath')}</h3><GamePathSelector /></section>
      <section>
        <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-3">{t('settings.appearance')}</h3>
        <div className="space-y-3">
          <div><label className="text-xs text-[var(--sf-text-muted)]">{t('settings.theme')}</label>
            <select value={theme} onChange={e => setTheme(e.target.value as ThemeId)} className="mt-1 w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]">
              {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select></div>
          <div><label className="text-xs text-[var(--sf-text-muted)]">{t('settings.language')}</label>
            <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'it')} className="mt-1 w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]">
              <option value="en">English</option><option value="it">Italiano</option>
            </select></div>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-3">{t('settings.editor')}</h3>
        <label className="flex items-center gap-2 text-sm text-[var(--sf-text-secondary)] cursor-pointer">
          <input type="checkbox" checked={codePanelVisible} onChange={toggleCodePanel} /> {t('settings.showCodePanel', 'Show code panel by default')}
        </label>
      </section>
    </div>
  );
}
