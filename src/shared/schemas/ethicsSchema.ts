// src/shared/schemas/ethicsSchema.ts
import type { CategorySchema } from '../types/categories';

export const ethicsSchema: CategorySchema = {
  category: 'ethics',
  gameFolder: 'common/ethics/',
  outputPath: 'common/ethics/',
  displayName: { en: 'Ethics', it: 'Etiche' },
  fields: [
    { key: 'key', label: { en: 'Ethic ID', it: 'ID Etica' }, type: 'text', required: true, group: 'general' },
    { key: 'cost', label: { en: 'Ethic Points Cost', it: 'Costo Punti Etica' }, type: 'number', required: false, default: 1, group: 'general' },
    { key: 'fanatic_variant', label: { en: 'Fanatic Variant', it: 'Variante Fanatica' }, type: 'text', required: false, group: 'general' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
