// src/shared/schemas/starClassesSchema.ts
import type { CategorySchema } from '../types/categories';

export const starClassesSchema: CategorySchema = {
  category: 'star_classes',
  gameFolder: 'common/star_classes/',
  outputPath: 'common/star_classes/',
  displayName: { en: 'Star Classes', it: 'Classi Stella' },
  fields: [
    { key: 'key', label: { en: 'Star Class ID', it: 'ID Classe Stella' }, type: 'text', required: true, group: 'general' },
    { key: 'is_star', label: { en: 'Is Star', it: 'È una Stella' }, type: 'boolean', required: false, default: true, group: 'general' },
    { key: 'planet_class', label: { en: 'Star Planet Class', it: 'Classe Pianeta Stella' }, type: 'text', required: false, group: 'general' },
    { key: 'num_planets', label: { en: 'Number of Planets', it: 'Numero di Pianeti' }, type: 'number', required: false, group: 'general' },
  ],
  validators: [],
};
