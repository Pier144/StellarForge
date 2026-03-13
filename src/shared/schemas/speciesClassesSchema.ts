// src/shared/schemas/speciesClassesSchema.ts
import type { CategorySchema } from '../types/categories';

export const speciesClassesSchema: CategorySchema = {
  category: 'species_classes',
  gameFolder: 'common/species_classes/',
  outputPath: 'common/species_classes/',
  displayName: { en: 'Species Classes', it: 'Classi Specie' },
  fields: [
    { key: 'key', label: { en: 'Species Class ID', it: 'ID Classe Specie' }, type: 'text', required: true, group: 'general' },
    { key: 'archetype', label: { en: 'Archetype', it: 'Archetipo' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'BIOLOGICAL', label: 'Biological' }, { value: 'LITHOID', label: 'Lithoid' },
        { value: 'MACHINE', label: 'Machine' }, { value: 'ROBOT', label: 'Robot' },
      ] },
    { key: 'portrait_modding', label: { en: 'Portrait Modding', it: 'Modding Ritratto' }, type: 'boolean', required: false, default: false, group: 'general' },
    { key: 'playable', label: { en: 'Playable', it: 'Giocabile' }, type: 'boolean', required: false, default: true, group: 'general' },
  ],
  validators: [],
};
