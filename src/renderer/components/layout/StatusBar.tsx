import { useProjectStore } from '../../stores/projectStore';
import { useGameDataStore } from '../../stores/gameDataStore';

export function StatusBar() {
  const project = useProjectStore(s => s.project);
  const dirty = useProjectStore(s => s.dirty);
  const gamePath = useGameDataStore(s => s.gamePath);

  return (
    <div className="h-6 flex items-center justify-between px-4 bg-[var(--sf-bg-secondary)] border-t border-[var(--sf-border)] text-[10px] text-[var(--sf-text-muted)]">
      <div className="flex items-center gap-3">
        <span>{project?.metadata.name ?? 'No project'}{dirty ? ' •' : ''}</span>
      </div>
      <div className="flex items-center gap-3">
        {gamePath && <span>Stellaris: {gamePath.split(/[/\\]/).pop()}</span>}
        <span>v{project?.metadata.version ?? '—'}</span>
      </div>
    </div>
  );
}
