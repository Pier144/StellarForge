import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({ onSearch, placeholder = 'Search...', debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, debounceMs, onSearch]);

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-[var(--sf-text-muted)] pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="6" cy="6" r="4" />
          <path d="M9.5 9.5l2.5 2.5" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-8 py-2 text-sm rounded-[var(--sf-radius-md)]
          bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
          border border-[var(--sf-border)]
          placeholder:text-[var(--sf-text-muted)]
          focus:outline-none focus:border-[var(--sf-border-active)] focus:shadow-[0_0_8px_var(--sf-accent-glow)]
          transition-all duration-150
        "
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 text-[var(--sf-text-muted)] hover:text-[var(--sf-text-primary)] transition-colors"
          aria-label="Clear search"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
