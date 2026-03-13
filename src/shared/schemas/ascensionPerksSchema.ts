// src/shared/schemas/ascensionPerksSchema.ts
import type { CategorySchema } from '../types/categories';

export const ascensionPerksSchema: CategorySchema = {
  category: 'ascension_perks',
  gameFolder: 'common/ascension_perks/',
  outputPath: 'common/ascension_perks/',
  displayName: { en: 'Ascension Perks', it: 'Perk Ascensione' },
  fields: [
    { key: 'key', label: { en: 'Ascension Perk ID', it: 'ID Perk Ascensione' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'on_enabled', label: { en: 'On Enabled Effects', it: 'Effetti All\'Abilitazione' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
