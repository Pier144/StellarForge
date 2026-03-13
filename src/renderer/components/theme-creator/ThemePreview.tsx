// src/renderer/components/theme-creator/ThemePreview.tsx
interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  border: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

interface Props {
  colors: ThemeColors;
}

export function ThemePreview({ colors }: Props) {
  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: colors.border, width: 280 }}>
      {/* Title bar */}
      <div className="h-6 flex items-center px-3" style={{ backgroundColor: colors.bgSecondary, borderBottom: `1px solid ${colors.border}` }}>
        <span className="text-[8px] font-bold tracking-wider" style={{ color: colors.accent }}>STELLARFORGE</span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.textMuted }}></div>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.textMuted }}></div>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
      </div>
      <div className="flex" style={{ height: 160 }}>
        {/* Sidebar */}
        <div className="w-16 p-1.5 space-y-0.5" style={{ backgroundColor: colors.bgSecondary, borderRight: `1px solid ${colors.border}` }}>
          {['Empire', 'Economy', 'Tech'].map((g, i) => (
            <div key={g} className="text-[6px] px-1.5 py-0.5 rounded" style={{
              color: i === 0 ? colors.accent : colors.textMuted,
              backgroundColor: i === 0 ? `${colors.accent}15` : 'transparent',
            }}>{g}</div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-2 space-y-1.5" style={{ backgroundColor: colors.bgPrimary }}>
          <div className="text-[7px] font-bold" style={{ color: colors.textPrimary }}>Editor</div>
          <div className="rounded p-1.5" style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <div className="text-[6px] mb-1" style={{ color: colors.textMuted }}>Field</div>
            <div className="h-3 rounded" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}></div>
          </div>
          <div className="flex gap-1">
            <div className="px-2 py-0.5 rounded text-[6px] text-white" style={{ backgroundColor: colors.accent }}>Save</div>
            <div className="px-2 py-0.5 rounded text-[6px]" style={{ color: colors.textSecondary, border: `1px solid ${colors.border}` }}>Cancel</div>
          </div>
        </div>
      </div>
      {/* Status bar */}
      <div className="h-4 px-2 flex items-center" style={{ backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}` }}>
        <span className="text-[6px]" style={{ color: colors.textMuted }}>Preview Mode</span>
      </div>
    </div>
  );
}
