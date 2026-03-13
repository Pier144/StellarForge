// src/shared/schemas/prescriptedCountriesSchema.ts
import type { CategorySchema } from '../types/categories';

export const prescriptedCountriesSchema: CategorySchema = {
  category: 'prescripted_countries',
  gameFolder: 'prescripted_countries/',
  outputPath: 'prescripted_countries/',
  displayName: { en: 'Prescripted Countries', it: 'Paesi Prescritti' },
  fields: [
    { key: 'key', label: { en: 'Country ID', it: 'ID Paese' }, type: 'text', required: true, group: 'general' },
    { key: 'species_class', label: { en: 'Species Class', it: 'Classe Specie' }, type: 'reference', required: true, group: 'general', referenceCategory: 'species_classes' },
    { key: 'name', label: { en: 'Empire Name', it: 'Nome Impero' }, type: 'text', required: true, group: 'general' },
    { key: 'initializer', label: { en: 'System Initializer', it: 'Inizializzatore Sistema' }, type: 'reference', required: false, group: 'general', referenceCategory: 'solar_system_initializers' },
  ],
  validators: [],
};
