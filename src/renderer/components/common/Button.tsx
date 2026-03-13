import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: 'bg-[var(--sf-accent)] text-[var(--sf-bg-primary)] hover:brightness-110 shadow-[0_0_15px_var(--sf-accent-glow)]',
  secondary: 'border border-[var(--sf-border-active)] text-[var(--sf-text-primary)] hover:bg-[var(--sf-bg-card)]',
  ghost: 'text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)] hover:bg-[var(--sf-bg-card)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`rounded-[var(--sf-radius-md)] font-medium transition-all duration-150 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
