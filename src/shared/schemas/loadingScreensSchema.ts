// src/shared/schemas/loadingScreensSchema.ts
import type { CategorySchema } from '../types/categories';

export const loadingScreensSchema: CategorySchema = {
  category: 'loading_screens',
  gameFolder: '',
  outputPath: 'gfx/loadingscreens/',
  displayName: { en: 'Loading Screens', it: 'Schermate Caricamento' },
  fields: [
    { key: 'key', label: { en: 'Screen ID', it: 'ID Schermata' }, type: 'text', required: true, group: 'general' },
    { key: 'texturefile', label: { en: 'Texture File', it: 'File Texture' }, type: 'text', required: true, group: 'general' },
    { key: 'weight', label: { en: 'Selection Weight', it: 'Peso Selezione' }, type: 'number', required: false, default: 1, group: 'general' },
  ],
  validators: [],
};
