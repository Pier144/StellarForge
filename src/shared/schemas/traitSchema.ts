// src/shared/schemas/traitSchema.ts
import type { CategorySchema } from '../types/categories';

export const traitSchema: CategorySchema = {
  category: 'traits',
  gameFolder: 'common/traits/',
  outputPath: 'common/traits/',
  displayName: { en: 'Traits', it: 'Tratti' },
  fields: [
    { key: 'key', label: { en: 'Trait ID', it: 'ID Tratto' }, type: 'text', required: true, group: 'general',
      tooltip: { en: 'Internal ID (e.g., trait_intelligent)', it: 'ID interno (es. trait_intelligent)' } },
    { key: 'cost', label: { en: 'Cost', it: 'Costo' }, type: 'number', required: true, default: 1, group: 'general',
      tooltip: { en: 'Trait point cost (positive = positive trait)', it: 'Costo in punti tratto' } },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'allowed_archetypes', label: { en: 'Allowed Archetypes', it: 'Archetipi Consentiti' }, type: 'multiselect',
      required: true, group: 'restrictions',
      options: [
        { value: 'BIOLOGICAL', label: 'Biological' }, { value: 'LITHOID', label: 'Lithoid' },
        { value: 'MACHINE', label: 'Machine' }, { value: 'ROBOT', label: 'Robot' },
        { value: 'PRESAPIENT', label: 'Pre-Sapient' },
      ] },
    { key: 'opposites', label: { en: 'Opposites', it: 'Opposti' }, type: 'multiselect', required: false,
      group: 'restrictions', referenceCategory: 'traits' },
    { key: 'initial', label: { en: 'Available at Start', it: 'Disponibile all\'Inizio' }, type: 'boolean',
      required: false, default: true, group: 'restrictions' },
    { key: 'randomized', label: { en: 'Can Appear Randomly', it: 'Appare Casualmente' }, type: 'boolean',
      required: false, default: true, group: 'restrictions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'slave_cost', label: { en: 'Slave Cost Modifier', it: 'Modificatore Costo Schiavo' }, type: 'modifier-list',
      required: false, group: 'effects' },
    { key: 'ai_weight', label: { en: 'AI Weight', it: 'Peso AI' }, type: 'number', required: false,
      default: 1, group: 'ai' },
  ],
  validators: [
    { rule: 'cost_balance', params: { warnIfAbove: 4, warnIfBelow: -4 } },
    { rule: 'opposite_symmetry', params: {} },
    { rule: 'modifier_exists', params: { field: 'modifier' } },
  ],
};
