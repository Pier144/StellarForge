// src/shared/schemas/leaderClassesSchema.ts
import type { CategorySchema } from '../types/categories';

export const leaderClassesSchema: CategorySchema = {
  category: 'leader_classes',
  gameFolder: 'common/leader_classes/',
  outputPath: 'common/leader_classes/',
  displayName: { en: 'Leader Classes', it: 'Classi Leader' },
  fields: [
    { key: 'key', label: { en: 'Leader Class ID', it: 'ID Classe Leader' }, type: 'text', required: true, group: 'general' },
    { key: 'generation_chance', label: { en: 'Generation Chance', it: 'Probabilità Generazione' }, type: 'number', required: false, default: 1, group: 'general' },
    { key: 'traits', label: { en: 'Possible Traits', it: 'Tratti Possibili' }, type: 'trigger-block', required: false, group: 'traits' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
