// src/shared/schemas/armiesSchema.ts
import type { CategorySchema } from '../types/categories';

export const armiesSchema: CategorySchema = {
  category: 'armies',
  gameFolder: 'common/armies/',
  outputPath: 'common/armies/',
  displayName: { en: 'Armies', it: 'Eserciti' },
  fields: [
    { key: 'key', label: { en: 'Army ID', it: 'ID Esercito' }, type: 'text', required: true, group: 'general' },
    { key: 'damage', label: { en: 'Damage', it: 'Danno' }, type: 'number', required: false, default: 1.0, group: 'stats' },
    { key: 'health', label: { en: 'Health', it: 'Salute' }, type: 'number', required: false, default: 1.0, group: 'stats' },
    { key: 'cost', label: { en: 'Build Cost', it: 'Costo Costruzione' }, type: 'resource-block', required: false, group: 'costs' },
    { key: 'prerequisites', label: { en: 'Required Technologies', it: 'Tecnologie Richieste' }, type: 'multiselect', required: false, group: 'requirements', referenceCategory: 'technologies' },
  ],
  validators: [],
};
