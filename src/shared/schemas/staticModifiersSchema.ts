// src/shared/schemas/staticModifiersSchema.ts
import type { CategorySchema } from '../types/categories';

export const staticModifiersSchema: CategorySchema = {
  category: 'static_modifiers',
  gameFolder: 'common/static_modifiers/',
  outputPath: 'common/static_modifiers/',
  displayName: { en: 'Static Modifiers', it: 'Modificatori Statici' },
  fields: [
    { key: 'key', label: { en: 'Modifier ID', it: 'ID Modificatore' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: true, group: 'effects' },
  ],
  validators: [],
};
