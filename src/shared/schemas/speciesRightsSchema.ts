// src/shared/schemas/speciesRightsSchema.ts
import type { CategorySchema } from '../types/categories';

export const speciesRightsSchema: CategorySchema = {
  category: 'species_rights',
  gameFolder: 'common/species_rights/',
  outputPath: 'common/species_rights/',
  displayName: { en: 'Species Rights', it: 'Diritti Specie' },
  fields: [
    { key: 'key', label: { en: 'Rights ID', it: 'ID Diritti' }, type: 'text', required: true, group: 'general' },
    { key: 'type', label: { en: 'Rights Type', it: 'Tipo Diritti' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'citizenship', label: 'Citizenship' }, { value: 'living_standard', label: 'Living Standard' },
        { value: 'migration', label: 'Migration' }, { value: 'colonization', label: 'Colonization' },
        { value: 'slavery', label: 'Slavery' }, { value: 'military_service', label: 'Military Service' },
      ] },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'modifier', label: { en: 'Modifiers', it: 'Modificatori' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
