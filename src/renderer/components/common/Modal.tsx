import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className={`
                w-full ${sizeClasses[size]}
                bg-[var(--sf-bg-secondary)]
                border border-[var(--sf-border-active)]
                rounded-[var(--sf-radius-lg)]
                shadow-[0_0_40px_var(--sf-accent-glow)]
              `}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sf-border)]">
                {title && (
                  <h2 className="text-sm font-semibold text-[var(--sf-text-primary)] uppercase tracking-wider">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)] transition-colors"
                  aria-label="Close modal"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="p-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
