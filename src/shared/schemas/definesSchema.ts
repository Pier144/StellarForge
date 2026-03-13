// src/shared/schemas/definesSchema.ts
import type { CategorySchema } from '../types/categories';

export const definesSchema: CategorySchema = {
  category: 'defines',
  gameFolder: 'common/defines/',
  outputPath: 'common/defines/',
  displayName: { en: 'Defines', it: 'Definizioni' },
  fields: [
    { key: 'key', label: { en: 'Define ID', it: 'ID Definizione' }, type: 'text', required: true, group: 'general' },
    { key: 'namespace', label: { en: 'Namespace', it: 'Namespace' }, type: 'text', required: true, group: 'general',
      tooltip: { en: 'e.g., NGameplay, NEconomy', it: 'es. NGameplay, NEconomy' } },
    { key: 'value', label: { en: 'Value', it: 'Valore' }, type: 'text', required: true, group: 'general' },
  ],
  validators: [],
};
