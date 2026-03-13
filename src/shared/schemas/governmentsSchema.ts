// src/shared/schemas/governmentsSchema.ts
import type { CategorySchema } from '../types/categories';

export const governmentsSchema: CategorySchema = {
  category: 'governments',
  gameFolder: 'common/governments/',
  outputPath: 'common/governments/',
  displayName: { en: 'Governments', it: 'Governi' },
  fields: [
    { key: 'key', label: { en: 'Government ID', it: 'ID Governo' }, type: 'text', required: true, group: 'general' },
    { key: 'ruler_title', label: { en: 'Ruler Title', it: 'Titolo Governante' }, type: 'text', required: false, group: 'general' },
    { key: 'election_type', label: { en: 'Election Type', it: 'Tipo Elezione' }, type: 'select', required: false, group: 'general',
      options: [{ value: 'none', label: 'None' }, { value: 'oligarchic', label: 'Oligarchic' }, { value: 'democratic', label: 'Democratic' }] },
    { key: 'valid_authorities', label: { en: 'Valid Authorities', it: 'Autorità Valide' }, type: 'multiselect', required: false, group: 'requirements', referenceCategory: 'authorities' },
  ],
  validators: [],
};
