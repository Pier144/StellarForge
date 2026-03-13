// src/shared/schemas/techSchema.ts
import type { CategorySchema } from '../types/categories';

export const techSchema: CategorySchema = {
  category: 'technologies',
  gameFolder: 'common/technology/',
  outputPath: 'common/technology/',
  displayName: { en: 'Technologies', it: 'Tecnologie' },
  fields: [
    { key: 'key', label: { en: 'Tech ID', it: 'ID Tecnologia' }, type: 'text', required: true, group: 'general' },
    { key: 'area', label: { en: 'Research Area', it: 'Area di Ricerca' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'physics', label: 'Physics' }, { value: 'society', label: 'Society' },
        { value: 'engineering', label: 'Engineering' },
      ] },
    { key: 'tier', label: { en: 'Tier', it: 'Livello' }, type: 'number', required: true, default: 1, group: 'general' },
    { key: 'cost', label: { en: 'Cost', it: 'Costo' }, type: 'number', required: true, group: 'general' },
    { key: 'weight', label: { en: 'Base Weight', it: 'Peso Base' }, type: 'number', required: true, default: 100, group: 'general' },
    { key: 'prerequisites', label: { en: 'Prerequisites', it: 'Prerequisiti' }, type: 'multiselect', required: false,
      group: 'requirements', referenceCategory: 'technologies' },
    { key: 'is_rare', label: { en: 'Rare Tech', it: 'Tech Rara' }, type: 'boolean', required: false, default: false, group: 'general' },
    { key: 'is_dangerous', label: { en: 'Dangerous Tech', it: 'Tech Pericolosa' }, type: 'boolean', required: false, group: 'general' },
    { key: 'potential', label: { en: 'Potential (Visibility)', it: 'Potenziale (Visibilità)' }, type: 'trigger-block',
      required: false, group: 'conditions' },
    { key: 'weight_modifier', label: { en: 'Weight Modifiers', it: 'Modificatori Peso' }, type: 'trigger-block',
      required: false, group: 'conditions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
  ],
  validators: [
    { rule: 'reference_exists', params: { field: 'prerequisites', category: 'technologies' } },
    { rule: 'tier_cost_consistency', params: {} },
  ],
};
