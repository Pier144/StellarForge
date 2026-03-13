// src/shared/schemas/traditionsSchema.ts
import type { CategorySchema } from '../types/categories';

export const traditionsSchema: CategorySchema = {
  category: 'traditions',
  gameFolder: 'common/traditions/',
  outputPath: 'common/traditions/',
  displayName: { en: 'Traditions', it: 'Tradizioni' },
  fields: [
    { key: 'key', label: { en: 'Tradition ID', it: 'ID Tradizione' }, type: 'text', required: true, group: 'general' },
    { key: 'cost', label: { en: 'Unity Cost', it: 'Costo Unità' }, type: 'number', required: false, default: 0, group: 'general' },
    { key: 'tradition_swap', label: { en: 'Tradition Swap', it: 'Scambio Tradizione' }, type: 'text', required: false, group: 'general' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'effect', label: { en: 'Effects', it: 'Effetti' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
