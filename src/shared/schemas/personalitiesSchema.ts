// src/shared/schemas/personalitiesSchema.ts
import type { CategorySchema } from '../types/categories';

export const personalitiesSchema: CategorySchema = {
  category: 'personalities',
  gameFolder: 'common/personalities/',
  outputPath: 'common/personalities/',
  displayName: { en: 'AI Personalities', it: 'Personalità AI' },
  fields: [
    { key: 'key', label: { en: 'Personality ID', it: 'ID Personalità' }, type: 'text', required: true, group: 'general' },
    { key: 'weight', label: { en: 'Weight', it: 'Peso' }, type: 'number', required: false, default: 10, group: 'general' },
    { key: 'ethics', label: { en: 'Required Ethics', it: 'Etiche Richieste' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
