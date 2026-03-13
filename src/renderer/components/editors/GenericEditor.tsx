// src/renderer/components/editors/GenericEditor.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CategorySchema, FieldDefinition } from '@shared/types/categories';
import { useTranslation } from 'react-i18next';

interface Props {
  schema: CategorySchema;
  item: Record<string, unknown>;
  onChange: (item: Record<string, unknown>) => void;
}

export function GenericEditor({ schema, item, onChange }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'it';
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const groups = new Map<string, FieldDefinition[]>();
  for (const field of schema.fields) {
    const group = field.group ?? 'general';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(field);
  }

  const toggleGroup = (g: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  const handleFieldChange = (key: string, value: unknown) => {
    onChange({ ...item, [key]: value });
  };

  const isFieldVisible = (field: FieldDefinition): boolean => {
    if (!field.condition) return true;
    return item[field.condition.field] === field.condition.value;
  };

  return (
    <div className="space-y-4 p-4">
      {[...groups.entries()].map(([groupName, fields]) => (
        <div key={groupName} className="border border-[var(--sf-border)] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleGroup(groupName)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--sf-bg-card)] text-sm font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider hover:bg-[var(--sf-bg-secondary)] transition-colors"
          >
            <span>{groupName}</span>
            <span className="text-xs">{collapsedGroups.has(groupName) ? '▸' : '▾'}</span>
          </button>
          <AnimatePresence>
            {!collapsedGroups.has(groupName) && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3 bg-[var(--sf-bg-primary)]">
                  {fields.filter(isFieldVisible).map(field => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={item[field.key]}
                      onChange={(v) => handleFieldChange(field.key, v)}
                      lang={lang}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function FieldRenderer({ field, value, onChange, lang }: {
  field: FieldDefinition;
  value: unknown;
  onChange: (v: unknown) => void;
  lang: 'en' | 'it';
}) {
  const label = field.label[lang] || field.label.en;
  const tooltip = field.tooltip?.[lang] || field.tooltip?.en;

  switch (field.type) {
    case 'text':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}{field.required && ' *'}</label>
          {tooltip && <p className="text-[10px] text-[var(--sf-text-muted)] mb-1">{tooltip}</p>}
          <input
            className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] focus:border-[var(--sf-accent)] focus:outline-none transition-colors"
            value={(value as string) ?? field.default ?? ''}
            onChange={e => onChange(e.target.value)}
          />
        </div>
      );

    case 'number':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}{field.required && ' *'}</label>
          {tooltip && <p className="text-[10px] text-[var(--sf-text-muted)] mb-1">{tooltip}</p>}
          <input
            type="number"
            className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] focus:border-[var(--sf-accent)] focus:outline-none transition-colors"
            value={(value as number) ?? field.default ?? 0}
            onChange={e => onChange(Number(e.target.value))}
          />
        </div>
      );

    case 'boolean':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(value as boolean) ?? (field.default as boolean) ?? false}
            onChange={e => onChange(e.target.checked)}
            className="accent-[var(--sf-accent)]"
          />
          <span className="text-sm text-[var(--sf-text-secondary)]">{label}</span>
        </label>
      );

    case 'select':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}{field.required && ' *'}</label>
          <select
            className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]"
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
          >
            <option value="">— Select —</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case 'multiselect':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}{field.required && ' *'}</label>
          <div className="flex flex-wrap gap-2 p-2 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded">
            {field.options?.map(opt => {
              const selected = Array.isArray(value) && (value as string[]).includes(opt.value);
              return (
                <button key={opt.value}
                  onClick={() => {
                    const arr = Array.isArray(value) ? [...(value as string[])] : [];
                    if (selected) onChange(arr.filter(v => v !== opt.value));
                    else onChange([...arr, opt.value]);
                  }}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    selected
                      ? 'bg-[var(--sf-accent)]/20 border-[var(--sf-accent)] text-[var(--sf-accent)]'
                      : 'border-[var(--sf-border)] text-[var(--sf-text-muted)] hover:border-[var(--sf-text-secondary)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'modifier-list':
    case 'trigger-block':
    case 'effect-block':
    case 'event-options':
    case 'resource-block':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}</label>
          <div className="p-3 bg-[var(--sf-bg-card)] border border-dashed border-[var(--sf-border)] rounded text-xs text-[var(--sf-text-muted)] italic">
            {field.type === 'modifier-list' && 'Modifier editor — coming in Chunk 7'}
            {field.type === 'trigger-block' && 'Trigger builder — coming in Chunk 7'}
            {field.type === 'effect-block' && 'Effect builder — coming in Chunk 7'}
            {field.type === 'event-options' && 'Event options editor — coming in Chunk 7'}
            {field.type === 'resource-block' && 'Resource editor — coming in Chunk 7'}
          </div>
        </div>
      );

    case 'icon':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}</label>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded flex items-center justify-center text-lg">
              {(value as string) ? '🖼️' : '—'}
            </div>
            <input
              className="flex-1 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]"
              value={(value as string) ?? ''}
              onChange={e => onChange(e.target.value)}
              placeholder="Icon path..."
            />
          </div>
        </div>
      );

    case 'color':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}</label>
          <input
            type="color"
            value={(value as string) ?? '#ffffff'}
            onChange={e => onChange(e.target.value)}
            className="w-10 h-10 rounded border border-[var(--sf-border)] cursor-pointer"
          />
        </div>
      );

    case 'reference':
      return (
        <div>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{label}</label>
          <input
            className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]"
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={`Reference to ${field.referenceCategory ?? 'item'}...`}
          />
        </div>
      );

    default:
      return null;
  }
}
