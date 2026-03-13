import { motion } from 'framer-motion';

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onTabChange: (key: string) => void;
}

export function Tabs({ tabs, activeKey, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-0 border-b border-[var(--sf-border)] relative">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              relative px-4 py-2.5 text-sm font-medium transition-colors duration-150
              ${isActive ? 'text-[var(--sf-text-primary)]' : 'text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)]'}
            `}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sf-accent)] rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
