// src/shared/schemas/agendasSchema.ts
import type { CategorySchema } from '../types/categories';

export const agendasSchema: CategorySchema = {
  category: 'agendas',
  gameFolder: 'common/agendas/',
  outputPath: 'common/agendas/',
  displayName: { en: 'Agendas', it: 'Agende' },
  fields: [
    { key: 'key', label: { en: 'Agenda ID', it: 'ID Agenda' }, type: 'text', required: true, group: 'general' },
    { key: 'weight', label: { en: 'Weight', it: 'Peso' }, type: 'number', required: false, default: 10, group: 'general' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
