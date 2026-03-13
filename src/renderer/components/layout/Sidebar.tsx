import { useUiStore } from '../../stores/uiStore';
import { CATEGORY_GROUPS, CATEGORIES } from '@shared/constants/categories';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Sidebar() {
  const { sidebarCollapsed, activeCategory, setActiveCategory } = useUiStore();
  const { t } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['empire']));

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  if (sidebarCollapsed) return <div className="w-12 bg-[var(--sf-bg-secondary)] border-r border-[var(--sf-border)]" />;

  return (
    <div className="w-56 bg-[var(--sf-bg-secondary)] border-r border-[var(--sf-border)] overflow-y-auto flex-shrink-0">
      {CATEGORY_GROUPS.map(group => (
        <div key={group.group}>
          <button
            onClick={() => toggleGroup(group.group)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-[var(--sf-text-muted)] hover:text-[var(--sf-text-secondary)]"
          >
            <span>{t(`sidebar.${group.group}`)}</span>
            <span className="text-[10px]">{expandedGroups.has(group.group) ? '▾' : '▸'}</span>
          </button>
          <AnimatePresence>
            {expandedGroups.has(group.group) && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                {CATEGORIES.filter(c => c.group === group.group).map(cat => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`w-full text-left px-6 py-1.5 text-sm transition-colors ${
                      activeCategory === cat.category
                        ? 'text-[var(--sf-accent)] bg-[var(--sf-accent)]/10 border-l-2 border-[var(--sf-accent)]'
                        : 'text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)] hover:bg-[var(--sf-bg-card)]'
                    }`}
                  >
                    {t(`categories.${cat.category}`)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
