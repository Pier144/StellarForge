// src/shared/schemas/edictsSchema.ts
import type { CategorySchema } from '../types/categories';

export const edictsSchema: CategorySchema = {
  category: 'edicts',
  gameFolder: 'common/edicts/',
  outputPath: 'common/edicts/',
  displayName: { en: 'Edicts', it: 'Editti' },
  fields: [
    { key: 'key', label: { en: 'Edict ID', it: 'ID Editto' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'length', label: { en: 'Duration (days)', it: 'Durata (giorni)' }, type: 'number', required: false, group: 'general' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
