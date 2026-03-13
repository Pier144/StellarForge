// src/shared/schemas/economicCategoriesSchema.ts
import type { CategorySchema } from '../types/categories';

export const economicCategoriesSchema: CategorySchema = {
  category: 'economic_categories',
  gameFolder: 'common/economic_categories/',
  outputPath: 'common/economic_categories/',
  displayName: { en: 'Economic Categories', it: 'Categorie Economiche' },
  fields: [
    { key: 'key', label: { en: 'Economic Category ID', it: 'ID Categoria Economica' }, type: 'text', required: true, group: 'general' },
    { key: 'parent', label: { en: 'Parent Category', it: 'Categoria Padre' }, type: 'reference', required: false, group: 'general', referenceCategory: 'economic_categories' },
    { key: 'use_for_ai_budget', label: { en: 'Used for AI Budget', it: 'Usata per Budget AI' }, type: 'boolean', required: false, default: false, group: 'general' },
  ],
  validators: [],
};
