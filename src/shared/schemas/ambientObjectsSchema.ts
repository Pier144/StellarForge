// src/shared/schemas/ambientObjectsSchema.ts
import type { CategorySchema } from '../types/categories';

export const ambientObjectsSchema: CategorySchema = {
  category: 'ambient_objects',
  gameFolder: 'common/ambient_objects/',
  outputPath: 'common/ambient_objects/',
  displayName: { en: 'Ambient Objects', it: 'Oggetti Ambiente' },
  fields: [
    { key: 'key', label: { en: 'Ambient Object ID', it: 'ID Oggetto Ambiente' }, type: 'text', required: true, group: 'general' },
    { key: 'entity', label: { en: 'Entity', it: 'Entità' }, type: 'text', required: false, group: 'general' },
    { key: 'selectable', label: { en: 'Selectable', it: 'Selezionabile' }, type: 'boolean', required: false, default: false, group: 'general' },
    { key: 'show_in_outliner', label: { en: 'Show in Outliner', it: 'Mostra nell\'Outliner' }, type: 'boolean', required: false, default: false, group: 'general' },
  ],
  validators: [],
};
