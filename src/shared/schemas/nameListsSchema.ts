// src/shared/schemas/nameListsSchema.ts
import type { CategorySchema } from '../types/categories';

export const nameListsSchema: CategorySchema = {
  category: 'name_lists',
  gameFolder: 'common/name_lists/',
  outputPath: 'common/name_lists/',
  displayName: { en: 'Name Lists', it: 'Liste Nomi' },
  fields: [
    { key: 'key', label: { en: 'Name List ID', it: 'ID Lista Nomi' }, type: 'text', required: true, group: 'general' },
    { key: 'randomized', label: { en: 'Used for Random Generation', it: 'Usata per Generazione Casuale' }, type: 'boolean', required: false, default: true, group: 'general' },
    { key: 'ship_names', label: { en: 'Ship Names', it: 'Nomi Navi' }, type: 'text', required: false, group: 'names' },
    { key: 'fleet_names', label: { en: 'Fleet Names', it: 'Nomi Flotte' }, type: 'text', required: false, group: 'names' },
  ],
  validators: [],
};
