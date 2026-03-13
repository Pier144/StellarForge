// src/shared/schemas/scriptedVariablesSchema.ts
import type { CategorySchema } from '../types/categories';

export const scriptedVariablesSchema: CategorySchema = {
  category: 'scripted_variables',
  gameFolder: 'common/scripted_variables/',
  outputPath: 'common/scripted_variables/',
  displayName: { en: 'Scripted Variables', it: 'Variabili Script' },
  fields: [
    { key: 'key', label: { en: 'Variable ID', it: 'ID Variabile' }, type: 'text', required: true, group: 'general' },
    { key: 'value', label: { en: 'Value', it: 'Valore' }, type: 'number', required: true, group: 'general' },
  ],
  validators: [],
};
