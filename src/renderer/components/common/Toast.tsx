import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useId, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeStyles: Record<ToastType, string> = {
  success: 'border-green-500/40 text-green-300',
  error: 'border-red-500/40 text-red-300',
  warning: 'border-yellow-500/40 text-yellow-300',
  info: 'border-[var(--sf-border-active)] text-[var(--sf-text-primary)]',
};

const typeIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const baseId = useId();
  let counter = 0;

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${baseId}-${Date.now()}-${counter++}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, [baseId]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-center gap-2.5 px-4 py-3 text-sm
                bg-[var(--sf-bg-secondary)] border rounded-[var(--sf-radius-md)]
                shadow-[0_0_20px_rgba(0,0,0,0.5)]
                pointer-events-auto min-w-[220px] max-w-[360px]
                ${typeStyles[toast.type]}
              `}
            >
              <span className="text-base leading-none">{typeIcons[toast.type]}</span>
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
