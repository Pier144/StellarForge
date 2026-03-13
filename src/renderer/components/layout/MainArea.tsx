export function MainArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-auto bg-[var(--sf-bg-primary)]">
      {children}
    </div>
  );
}
