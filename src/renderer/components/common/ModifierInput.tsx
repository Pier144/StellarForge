const MODIFIER_OPTIONS = [
  'pop_happiness',
  'energy_production',
  'research_speed',
  'food_output',
  'mineral_production',
  'trade_value',
  'stability',
  'fleet_power',
];

const OPERATOR_OPTIONS = [
  { value: '+', label: '+' },
  { value: '×', label: '×' },
  { value: '=', label: '=' },
];

interface ModifierValue {
  modifier: string;
  operator: string;
  value: number;
}

interface ModifierInputProps {
  value: ModifierValue;
  onChange: (value: ModifierValue) => void;
}

export function ModifierInput({ value, onChange }: ModifierInputProps) {
  return (
    <div className="flex gap-2 items-center">
      <select
        value={value.modifier}
        onChange={(e) => onChange({ ...value, modifier: e.target.value })}
        className="
          flex-1 px-3 py-2 text-sm rounded-[var(--sf-radius-md)] appearance-none
          bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
          border border-[var(--sf-border)]
          focus:outline-none focus:border-[var(--sf-border-active)]
          transition-all duration-150 cursor-pointer
        "
      >
        {MODIFIER_OPTIONS.map((mod) => (
          <option key={mod} value={mod} className="bg-[var(--sf-bg-secondary)]">
            {mod}
          </option>
        ))}
      </select>

      <select
        value={value.operator}
        onChange={(e) => onChange({ ...value, operator: e.target.value })}
        className="
          w-14 px-2 py-2 text-sm rounded-[var(--sf-radius-md)] appearance-none text-center
          bg-[var(--sf-bg-secondary)] text-[var(--sf-accent)]
          border border-[var(--sf-border)]
          focus:outline-none focus:border-[var(--sf-border-active)]
          transition-all duration-150 cursor-pointer font-mono
        "
      >
        {OPERATOR_OPTIONS.map((op) => (
          <option key={op.value} value={op.value} className="bg-[var(--sf-bg-secondary)]">
            {op.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={value.value}
        onChange={(e) => onChange({ ...value, value: parseFloat(e.target.value) || 0 })}
        className="
          w-20 px-3 py-2 text-sm rounded-[var(--sf-radius-md)]
          bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
          border border-[var(--sf-border)]
          focus:outline-none focus:border-[var(--sf-border-active)]
          transition-all duration-150 text-right
        "
        step="0.1"
      />
    </div>
  );
}
