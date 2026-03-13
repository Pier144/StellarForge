// src/shared/schemas/authoritiesSchema.ts
import type { CategorySchema } from '../types/categories';

export const authoritiesSchema: CategorySchema = {
  category: 'authorities',
  gameFolder: 'common/governments/authorities/',
  outputPath: 'common/governments/authorities/',
  displayName: { en: 'Authorities', it: 'Autorità' },
  fields: [
    { key: 'key', label: { en: 'Authority ID', it: 'ID Autorità' }, type: 'text', required: true, group: 'general' },
    { key: 'election_term_years', label: { en: 'Election Term (years)', it: 'Durata Mandato (anni)' }, type: 'number', required: false, group: 'general' },
    { key: 'has_elections', label: { en: 'Has Elections', it: 'Ha Elezioni' }, type: 'boolean', required: false, default: false, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
  ],
  validators: [],
};
