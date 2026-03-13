// src/renderer/components/editors/CategoryListView.tsx
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useProjectStore } from '../../stores/projectStore';
import { useUiStore } from '../../stores/uiStore';
import { useTranslation } from 'react-i18next';
import type { CategorySchema } from '@shared/types/categories';

interface Props {
  schema: CategorySchema;
}

export function CategoryListView({ schema }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'it';
  const project = useProjectStore(s => s.project);
  const setItem = useProjectStore(s => s.setItem);
  const setActiveItem = useUiStore(s => s.setActiveItem);

  const items = project?.items[schema.category] ?? {};
  const itemEntries = Object.entries(items);

  const handleNew = () => {
    const defaults: Record<string, unknown> = {};
    for (const field of schema.fields) {
      if (field.default !== undefined) defaults[field.key] = field.default;
    }
    const key = `new_${schema.category}_${Date.now()}`;
    defaults.key = key;
    setItem(schema.category, key, defaults);
    setActiveItem(schema.category, key);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[var(--sf-text-primary)]" style={{ fontFamily: 'var(--sf-font-display)' }}>
          {schema.displayName[lang] || schema.displayName.en}
        </h2>
        <Button variant="primary" size="sm" onClick={handleNew}>
          + {t('actions.new', 'New')}
        </Button>
      </div>

      {itemEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[var(--sf-text-muted)] mb-4">
            {t('editor.emptyState', { category: schema.displayName[lang] || schema.displayName.en })}
          </p>
          <Button variant="secondary" onClick={handleNew}>
            {t('editor.createFirst', 'Create your first item')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {itemEntries.map(([key, itemData]) => {
            const data = itemData as Record<string, unknown>;
            return (
              <Card key={key}>
                <button
                  onClick={() => setActiveItem(schema.category, key)}
                  className="w-full text-left p-4"
                >
                  <div className="text-sm font-medium text-[var(--sf-text-primary)] truncate">
                    {(data.key as string) ?? key}
                  </div>
                  <div className="text-xs text-[var(--sf-text-muted)] mt-1 truncate">
                    {schema.category}
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
