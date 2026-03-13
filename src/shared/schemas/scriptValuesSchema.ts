// src/shared/schemas/scriptValuesSchema.ts
import type { CategorySchema } from '../types/categories';

export const scriptValuesSchema: CategorySchema = {
  category: 'script_values',
  gameFolder: 'common/script_values/',
  outputPath: 'common/script_values/',
  displayName: { en: 'Script Values', it: 'Valori Script' },
  fields: [
    { key: 'key', label: { en: 'Value ID', it: 'ID Valore' }, type: 'text', required: true, group: 'general' },
    { key: 'base', label: { en: 'Base Value', it: 'Valore Base' }, type: 'number', required: false, default: 0, group: 'general' },
    { key: 'complex', label: { en: 'Complex Expression', it: 'Espressione Complessa' }, type: 'trigger-block', required: false, group: 'general' },
  ],
  validators: [],
};
