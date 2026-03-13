// src/shared/schemas/planetClassesSchema.ts
import type { CategorySchema } from '../types/categories';

export const planetClassesSchema: CategorySchema = {
  category: 'planet_classes',
  gameFolder: 'common/planet_classes/',
  outputPath: 'common/planet_classes/',
  displayName: { en: 'Planet Classes', it: 'Classi Pianeta' },
  fields: [
    { key: 'key', label: { en: 'Planet Class ID', it: 'ID Classe Pianeta' }, type: 'text', required: true, group: 'general' },
    { key: 'star_class', label: { en: 'Star Class', it: 'Classe Stella' }, type: 'select', required: false, group: 'general',
      options: [
        { value: 'sc_a', label: 'A-Class' }, { value: 'sc_b', label: 'B-Class' },
        { value: 'sc_f', label: 'F-Class' }, { value: 'sc_g', label: 'G-Class' },
        { value: 'sc_k', label: 'K-Class' }, { value: 'sc_m', label: 'M-Class' },
      ] },
    { key: 'habitability', label: { en: 'Base Habitability', it: 'Abitabilità Base' }, type: 'number', required: false, default: 0, group: 'general' },
    { key: 'colonizable', label: { en: 'Colonizable', it: 'Colonizzabile' }, type: 'boolean', required: false, default: true, group: 'general' },
    { key: 'modifier', label: { en: 'Planet Modifiers', it: 'Modificatori Pianeta' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
