// src/shared/schemas/popCategoriesSchema.ts
import type { CategorySchema } from '../types/categories';

export const popCategoriesSchema: CategorySchema = {
  category: 'pop_categories',
  gameFolder: 'common/pop_categories/',
  outputPath: 'common/pop_categories/',
  displayName: { en: 'Pop Categories', it: 'Categorie Pop' },
  fields: [
    { key: 'key', label: { en: 'Category ID', it: 'ID Categoria' }, type: 'text', required: true, group: 'general' },
    { key: 'rank', label: { en: 'Rank', it: 'Rango' }, type: 'number', required: false, default: 1, group: 'general' },
    { key: 'education', label: { en: 'Education Upkeep', it: 'Mantenimento Istruzione' }, type: 'resource-block', required: false, group: 'costs' },
    { key: 'upkeep', label: { en: 'Upkeep', it: 'Mantenimento' }, type: 'resource-block', required: false, group: 'costs' },
  ],
  validators: [],
};
