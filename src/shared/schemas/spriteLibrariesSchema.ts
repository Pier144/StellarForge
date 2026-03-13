// src/shared/schemas/spriteLibrariesSchema.ts
import type { CategorySchema } from '../types/categories';

export const spriteLibrariesSchema: CategorySchema = {
  category: 'sprite_libraries',
  gameFolder: '',
  outputPath: 'gfx/interface/',
  displayName: { en: 'Sprite Libraries', it: 'Librerie Sprite' },
  fields: [
    { key: 'key', label: { en: 'Sprite ID', it: 'ID Sprite' }, type: 'text', required: true, group: 'general' },
    { key: 'texturefile', label: { en: 'Texture File', it: 'File Texture' }, type: 'text', required: true, group: 'general' },
    { key: 'noOfFrames', label: { en: 'Number of Frames', it: 'Numero di Frame' }, type: 'number', required: false, default: 1, group: 'general' },
    { key: 'effectFile', label: { en: 'Effect File', it: 'File Effetto' }, type: 'text', required: false, group: 'general' },
  ],
  validators: [],
};
