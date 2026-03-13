// src/shared/schemas/empireFlagsSchema.ts
import type { CategorySchema } from '../types/categories';

export const empireFlagsSchema: CategorySchema = {
  category: 'empire_flags',
  gameFolder: '',
  outputPath: 'flags/',
  displayName: { en: 'Empire Flags', it: 'Bandiere Impero' },
  fields: [
    { key: 'key', label: { en: 'Flag ID', it: 'ID Bandiera' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Emblem Icon', it: 'Icona Emblema' }, type: 'icon', required: false, group: 'general' },
    { key: 'background', label: { en: 'Background', it: 'Sfondo' }, type: 'text', required: false, group: 'general' },
    { key: 'colors', label: { en: 'Colors', it: 'Colori' }, type: 'color', required: false, group: 'general' },
  ],
  validators: [],
};
