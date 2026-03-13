// src/shared/schemas/buildingSchema.ts
import type { CategorySchema } from '../types/categories';

export const buildingSchema: CategorySchema = {
  category: 'buildings',
  gameFolder: 'common/buildings/',
  outputPath: 'common/buildings/',
  displayName: { en: 'Buildings', it: 'Edifici' },
  fields: [
    { key: 'key', label: { en: 'Building ID', it: 'ID Edificio' }, type: 'text', required: true, group: 'general' },
    { key: 'base_buildtime', label: { en: 'Build Time (days)', it: 'Tempo Costruzione (giorni)' },
      type: 'number', required: true, default: 360, group: 'general' },
    { key: 'base_cap_amount', label: { en: 'Max per Planet', it: 'Max per Pianeta' },
      type: 'number', required: false, default: 1, group: 'general' },
    { key: 'category', label: { en: 'Category', it: 'Categoria' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'manufacturing', label: 'Manufacturing' }, { value: 'research', label: 'Research' },
        { value: 'trade', label: 'Trade' }, { value: 'unity', label: 'Unity' },
        { value: 'amenity', label: 'Amenity' }, { value: 'government', label: 'Government' },
        { value: 'army', label: 'Army' }, { value: 'resource', label: 'Resource' },
      ] },
    { key: 'potential', label: { en: 'Potential (Visibility)', it: 'Potenziale' }, type: 'trigger-block',
      required: false, group: 'conditions' },
    { key: 'allow', label: { en: 'Allow (Build Conditions)', it: 'Consenti' }, type: 'trigger-block',
      required: false, group: 'conditions' },
    { key: 'prerequisites', label: { en: 'Required Technologies', it: 'Tecnologie Richieste' },
      type: 'multiselect', required: false, group: 'requirements', referenceCategory: 'technologies' },
    { key: 'resources', label: { en: 'Resources', it: 'Risorse' }, type: 'resource-block',
      required: false, group: 'costs',
      tooltip: { en: 'Build cost and upkeep', it: 'Costo costruzione e mantenimento' } },
    { key: 'planet_modifier', label: { en: 'Planet Modifiers', it: 'Modificatori Pianeta' },
      type: 'modifier-list', required: false, group: 'effects' },
    { key: 'triggered_planet_modifier', label: { en: 'Triggered Modifiers', it: 'Modificatori Condizionali' },
      type: 'trigger-block', required: false, group: 'effects' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'upgrades', label: { en: 'Upgrades To', it: 'Si Migliora In' }, type: 'multiselect',
      required: false, group: 'general', referenceCategory: 'buildings' },
  ],
  validators: [
    { rule: 'reference_exists', params: { field: 'prerequisites', category: 'technologies' } },
    { rule: 'reference_exists', params: { field: 'upgrades', category: 'buildings' } },
  ],
};
