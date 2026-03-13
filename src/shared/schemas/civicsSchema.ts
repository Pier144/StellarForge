// src/shared/schemas/civicsSchema.ts
import type { CategorySchema } from '../types/categories';

export const civicsSchema: CategorySchema = {
  category: 'civics',
  gameFolder: 'common/governments/civics/',
  outputPath: 'common/governments/civics/',
  displayName: { en: 'Civics', it: 'Civiche' },
  fields: [
    { key: 'key', label: { en: 'Civic ID', it: 'ID Civica' }, type: 'text', required: true, group: 'general' },
    { key: 'description', label: { en: 'Description Key', it: 'Chiave Descrizione' }, type: 'text', required: false, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
