import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-[var(--sf-text-secondary)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 text-sm rounded-[var(--sf-radius-md)]
          bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
          border ${error ? 'border-red-500' : 'border-[var(--sf-border)]'}
          placeholder:text-[var(--sf-text-muted)]
          focus:outline-none focus:border-[var(--sf-border-active)] focus:shadow-[0_0_8px_var(--sf-accent-glow)]
          transition-all duration-150
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
}
