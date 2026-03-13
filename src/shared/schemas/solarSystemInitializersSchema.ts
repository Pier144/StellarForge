// src/shared/schemas/solarSystemInitializersSchema.ts
import type { CategorySchema } from '../types/categories';

export const solarSystemInitializersSchema: CategorySchema = {
  category: 'solar_system_initializers',
  gameFolder: 'common/solar_system_initializers/',
  outputPath: 'common/solar_system_initializers/',
  displayName: { en: 'System Initializers', it: 'Inizializzatori Sistemi' },
  fields: [
    { key: 'key', label: { en: 'Initializer ID', it: 'ID Inizializzatore' }, type: 'text', required: true, group: 'general' },
    { key: 'name', label: { en: 'System Name Key', it: 'Chiave Nome Sistema' }, type: 'text', required: false, group: 'general' },
    { key: 'class', label: { en: 'Star Class', it: 'Classe Stella' }, type: 'reference', required: false, group: 'general', referenceCategory: 'star_classes' },
    { key: 'flags', label: { en: 'System Flags', it: 'Flag Sistema' }, type: 'multiselect', required: false, group: 'general',
      options: [] },
    { key: 'usage', label: { en: 'Usage Type', it: 'Tipo Utilizzo' }, type: 'select', required: false, group: 'general',
      options: [{ value: 'misc_system_init', label: 'Misc' }, { value: 'origin', label: 'Origin' }, { value: 'starting_system', label: 'Starting System' }] },
  ],
  validators: [],
};
