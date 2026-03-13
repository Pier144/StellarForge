// src/shared/schemas/guiFilesSchema.ts
import type { CategorySchema } from '../types/categories';

export const guiFilesSchema: CategorySchema = {
  category: 'gui_files',
  gameFolder: '',
  outputPath: 'interface/',
  displayName: { en: 'GUI Files', it: 'File GUI' },
  fields: [
    { key: 'key', label: { en: 'GUI File ID', it: 'ID File GUI' }, type: 'text', required: true, group: 'general' },
    { key: 'filename', label: { en: 'File Name', it: 'Nome File' }, type: 'text', required: true, group: 'general' },
    { key: 'gui_type', label: { en: 'GUI Type', it: 'Tipo GUI' }, type: 'select', required: false, group: 'general',
      options: [{ value: 'containerWindowType', label: 'Container Window' }, { value: 'buttonType', label: 'Button' }, { value: 'iconType', label: 'Icon' }] },
  ],
  validators: [],
};
