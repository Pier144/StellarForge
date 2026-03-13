// src/shared/schemas/iconsSchema.ts
import type { CategorySchema } from '../types/categories';

export const iconsSchema: CategorySchema = {
  category: 'icons',
  gameFolder: '',
  outputPath: 'gfx/interface/icons/',
  displayName: { en: 'Icons', it: 'Icone' },
  fields: [
    { key: 'key', label: { en: 'Icon ID', it: 'ID Icona' }, type: 'text', required: true, group: 'general' },
    { key: 'texturefile', label: { en: 'Texture File', it: 'File Texture' }, type: 'text', required: true, group: 'general' },
    { key: 'noOfFrames', label: { en: 'Number of Frames', it: 'Numero di Frame' }, type: 'number', required: false, default: 1, group: 'general' },
  ],
  validators: [],
};
