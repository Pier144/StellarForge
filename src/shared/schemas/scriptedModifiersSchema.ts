// src/shared/schemas/scriptedModifiersSchema.ts
import type { CategorySchema } from '../types/categories';

export const scriptedModifiersSchema: CategorySchema = {
  category: 'scripted_modifiers',
  gameFolder: 'common/scripted_modifiers/',
  outputPath: 'common/scripted_modifiers/',
  displayName: { en: 'Scripted Modifiers', it: 'Modificatori Script' },
  fields: [
    { key: 'key', label: { en: 'Modifier ID', it: 'ID Modificatore' }, type: 'text', required: true, group: 'general' },
    { key: 'modifier', label: { en: 'Modifier Block', it: 'Blocco Modificatore' }, type: 'modifier-list', required: true, group: 'effects' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
  ],
  validators: [],
};
