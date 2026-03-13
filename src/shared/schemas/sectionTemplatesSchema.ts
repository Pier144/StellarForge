// src/shared/schemas/sectionTemplatesSchema.ts
import type { CategorySchema } from '../types/categories';

export const sectionTemplatesSchema: CategorySchema = {
  category: 'section_templates',
  gameFolder: 'common/section_templates/',
  outputPath: 'common/section_templates/',
  displayName: { en: 'Section Templates', it: 'Template Sezioni' },
  fields: [
    { key: 'key', label: { en: 'Section ID', it: 'ID Sezione' }, type: 'text', required: true, group: 'general' },
    { key: 'ship_size', label: { en: 'Ship Size', it: 'Dimensione Nave' }, type: 'reference', required: true, group: 'general', referenceCategory: 'ship_sizes' },
    { key: 'entity', label: { en: 'Entity', it: 'Entità' }, type: 'text', required: false, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
  ],
  validators: [],
};
