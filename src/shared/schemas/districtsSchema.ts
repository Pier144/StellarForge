// src/shared/schemas/districtsSchema.ts
import type { CategorySchema } from '../types/categories';

export const districtsSchema: CategorySchema = {
  category: 'districts',
  gameFolder: 'common/districts/',
  outputPath: 'common/districts/',
  displayName: { en: 'Districts', it: 'Distretti' },
  fields: [
    { key: 'key', label: { en: 'District ID', it: 'ID Distretto' }, type: 'text', required: true, group: 'general' },
    { key: 'base_buildtime', label: { en: 'Build Time (days)', it: 'Tempo Costruzione (giorni)' }, type: 'number', required: true, default: 240, group: 'general' },
    { key: 'max_per_planet', label: { en: 'Max per Planet', it: 'Max per Pianeta' }, type: 'number', required: false, group: 'general' },
    { key: 'prerequisites', label: { en: 'Required Technologies', it: 'Tecnologie Richieste' }, type: 'multiselect', required: false, group: 'requirements', referenceCategory: 'technologies' },
    { key: 'planet_modifier', label: { en: 'Planet Modifiers', it: 'Modificatori Pianeta' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
