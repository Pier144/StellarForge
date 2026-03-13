// src/renderer/components/project/ProjectWelcome.tsx
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';

interface Props {
  onNew: () => void;
  onOpen: () => void;
  onImport: () => void;
  onOpenRecent: (path: string) => void;
  recentProjects: Array<{ name: string; path: string; lastModified: number }>;
}

export function ProjectWelcome({ onNew, onOpen, onImport, onOpenRecent, recentProjects }: Props) {
  const { t } = useTranslation();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--sf-bg-primary)]">
      <h1 className="text-4xl font-bold tracking-widest text-[var(--sf-accent)] mb-2" style={{ fontFamily: 'var(--sf-font-display)' }}>
        STELLARFORGE
      </h1>
      <p className="text-sm text-[var(--sf-text-muted)] mb-10">{t('app.subtitle', 'Visual Stellaris Mod Editor')}</p>
      <div className="flex gap-4 mb-10">
        <Button variant="primary" size="lg" onClick={onNew}>{t('app.newProject')}</Button>
        <Button variant="secondary" size="lg" onClick={onOpen}>{t('app.openProject')}</Button>
        <Button variant="ghost" size="lg" onClick={onImport}>{t('app.importProject', 'Import')}</Button>
      </div>
      {recentProjects.length > 0 && (
        <div className="w-96">
          <h3 className="text-xs uppercase tracking-wider text-[var(--sf-text-muted)] mb-3">{t('app.recentProjects', 'Recent Projects')}</h3>
          <div className="space-y-2">
            {recentProjects.slice(0, 5).map(p => (
              <button key={p.path} onClick={() => onOpenRecent(p.path)}
                className="w-full text-left px-4 py-3 rounded bg-[var(--sf-bg-card)] border border-[var(--sf-border)] hover:border-[var(--sf-accent)] transition-colors">
                <div className="text-sm text-[var(--sf-text-primary)]">{p.name}</div>
                <div className="text-xs text-[var(--sf-text-muted)] truncate">{p.path}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
