import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  const isClickable = !!onClick;

  return (
    <motion.div
      onClick={onClick}
      whileHover={isClickable ? { scale: 1.01, boxShadow: '0 0 20px var(--sf-accent-glow)' } : undefined}
      className={`
        rounded-[var(--sf-radius-lg)]
        bg-[var(--sf-bg-card)]
        border border-[var(--sf-border)]
        backdrop-blur-sm
        transition-colors duration-150
        ${isClickable ? 'cursor-pointer hover:border-[var(--sf-border-active)]' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
