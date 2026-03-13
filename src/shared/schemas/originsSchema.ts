// src/shared/schemas/originsSchema.ts
import type { CategorySchema } from '../types/categories';

export const originsSchema: CategorySchema = {
  category: 'origins',
  gameFolder: 'common/governments/origins/',
  outputPath: 'common/governments/origins/',
  displayName: { en: 'Origins', it: 'Origini' },
  fields: [
    { key: 'key', label: { en: 'Origin ID', it: 'ID Origine' }, type: 'text', required: true, group: 'general' },
    { key: 'description', label: { en: 'Description Key', it: 'Chiave Descrizione' }, type: 'text', required: false, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'initializers', label: { en: 'System Initializers', it: 'Inizializzatori Sistema' }, type: 'multiselect', required: false, group: 'general', referenceCategory: 'solar_system_initializers' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
