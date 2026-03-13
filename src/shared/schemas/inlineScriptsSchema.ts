// src/shared/schemas/inlineScriptsSchema.ts
import type { CategorySchema } from '../types/categories';

export const inlineScriptsSchema: CategorySchema = {
  category: 'inline_scripts',
  gameFolder: 'common/inline_scripts/',
  outputPath: 'common/inline_scripts/',
  displayName: { en: 'Inline Scripts', it: 'Script Inline' },
  fields: [
    { key: 'key', label: { en: 'Script ID', it: 'ID Script' }, type: 'text', required: true, group: 'general' },
    { key: 'parameters', label: { en: 'Parameters', it: 'Parametri' }, type: 'text', required: false, group: 'general' },
    { key: 'effect', label: { en: 'Script Content', it: 'Contenuto Script' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
