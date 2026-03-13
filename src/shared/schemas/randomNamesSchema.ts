// src/shared/schemas/randomNamesSchema.ts
import type { CategorySchema } from '../types/categories';

export const randomNamesSchema: CategorySchema = {
  category: 'random_names',
  gameFolder: 'common/random_names/',
  outputPath: 'common/random_names/',
  displayName: { en: 'Random Names', it: 'Nomi Casuali' },
  fields: [
    { key: 'key', label: { en: 'Name Group ID', it: 'ID Gruppo Nomi' }, type: 'text', required: true, group: 'general' },
    { key: 'sequential', label: { en: 'Sequential Generation', it: 'Generazione Sequenziale' }, type: 'boolean', required: false, default: false, group: 'general' },
    { key: 'names', label: { en: 'Name List', it: 'Lista Nomi' }, type: 'text', required: false, group: 'names' },
  ],
  validators: [],
};
