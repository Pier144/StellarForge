export function TitleBar() {
  return (
    <div className="h-9 flex items-center justify-between px-4 bg-[var(--sf-bg-secondary)] border-b border-[var(--sf-border)] select-none" style={{ WebkitAppRegion: 'drag' } as any}>
      <span className="text-xs font-semibold tracking-wider text-[var(--sf-accent)]" style={{ fontFamily: 'var(--sf-font-display)' }}>
        STELLARFORGE
      </span>
      <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button onClick={() => window.stellarforge.window.minimize()} className="w-8 h-7 flex items-center justify-center hover:bg-[var(--sf-bg-card)] rounded text-[var(--sf-text-secondary)]">−</button>
        <button onClick={() => window.stellarforge.window.maximize()} className="w-8 h-7 flex items-center justify-center hover:bg-[var(--sf-bg-card)] rounded text-[var(--sf-text-secondary)]">□</button>
        <button onClick={() => window.stellarforge.window.close()} className="w-8 h-7 flex items-center justify-center hover:bg-red-600 rounded text-[var(--sf-text-secondary)] hover:text-white">×</button>
      </div>
    </div>
  );
}
