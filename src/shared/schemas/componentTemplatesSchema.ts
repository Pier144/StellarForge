// src/shared/schemas/componentTemplatesSchema.ts
import type { CategorySchema } from '../types/categories';

export const componentTemplatesSchema: CategorySchema = {
  category: 'component_templates',
  gameFolder: 'common/component_templates/',
  outputPath: 'common/component_templates/',
  displayName: { en: 'Component Templates', it: 'Template Componenti' },
  fields: [
    { key: 'key', label: { en: 'Component ID', it: 'ID Componente' }, type: 'text', required: true, group: 'general' },
    { key: 'type', label: { en: 'Component Type', it: 'Tipo Componente' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'weapon', label: 'Weapon' }, { value: 'utility', label: 'Utility' },
        { value: 'ftl', label: 'FTL' }, { value: 'thruster', label: 'Thruster' },
        { value: 'sensor', label: 'Sensor' }, { value: 'computer', label: 'Combat Computer' },
      ] },
    { key: 'size', label: { en: 'Size', it: 'Dimensione' }, type: 'select', required: false, group: 'general',
      options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }, { value: 'extra_large', label: 'Extra Large' }] },
    { key: 'cost', label: { en: 'Cost', it: 'Costo' }, type: 'resource-block', required: false, group: 'costs' },
    { key: 'prerequisites', label: { en: 'Required Technologies', it: 'Tecnologie Richieste' }, type: 'multiselect', required: false, group: 'requirements', referenceCategory: 'technologies' },
  ],
  validators: [],
};
