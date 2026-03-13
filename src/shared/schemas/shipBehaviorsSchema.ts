// src/shared/schemas/shipBehaviorsSchema.ts
import type { CategorySchema } from '../types/categories';

export const shipBehaviorsSchema: CategorySchema = {
  category: 'ship_behaviors',
  gameFolder: 'common/ship_behaviors/',
  outputPath: 'common/ship_behaviors/',
  displayName: { en: 'Ship Behaviors', it: 'Comportamenti Nave' },
  fields: [
    { key: 'key', label: { en: 'Behavior ID', it: 'ID Comportamento' }, type: 'text', required: true, group: 'general' },
    { key: 'attack_range', label: { en: 'Attack Range', it: 'Raggio Attacco' }, type: 'number', required: false, group: 'stats' },
    { key: 'formation_distance', label: { en: 'Formation Distance', it: 'Distanza Formazione' }, type: 'number', required: false, group: 'stats' },
    { key: 'flee_if_combat_is_dangerous', label: { en: 'Flee if Danger', it: 'Fuggi se Pericolo' }, type: 'boolean', required: false, default: false, group: 'general' },
  ],
  validators: [],
};
