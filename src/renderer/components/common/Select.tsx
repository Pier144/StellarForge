import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function Select({ label, options, value, onChange, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-[var(--sf-text-secondary)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
            w-full px-3 py-2 text-sm rounded-[var(--sf-radius-md)] appearance-none
            bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
            border border-[var(--sf-border)]
            focus:outline-none focus:border-[var(--sf-border-active)] focus:shadow-[0_0_8px_var(--sf-accent-glow)]
            transition-all duration-150 cursor-pointer
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--sf-bg-secondary)]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--sf-text-secondary)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
