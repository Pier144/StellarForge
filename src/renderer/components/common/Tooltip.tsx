import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
              px-2.5 py-1.5 text-xs whitespace-nowrap
              bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)]
              border border-[var(--sf-border-active)]
              rounded-[var(--sf-radius-sm)]
              shadow-[0_0_10px_var(--sf-accent-glow)]
              pointer-events-none
            "
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
