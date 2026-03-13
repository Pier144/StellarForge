// src/shared/schemas/globalShipDesignsSchema.ts
import type { CategorySchema } from '../types/categories';

export const globalShipDesignsSchema: CategorySchema = {
  category: 'global_ship_designs',
  gameFolder: 'common/global_ship_designs/',
  outputPath: 'common/global_ship_designs/',
  displayName: { en: 'Ship Designs', it: 'Design Navi' },
  fields: [
    { key: 'key', label: { en: 'Design ID', it: 'ID Design' }, type: 'text', required: true, group: 'general' },
    { key: 'ship_size', label: { en: 'Ship Size', it: 'Dimensione Nave' }, type: 'reference', required: true, group: 'general', referenceCategory: 'ship_sizes' },
    { key: 'auto_upgrade', label: { en: 'Auto Upgrade', it: 'Auto Migliora' }, type: 'boolean', required: false, default: false, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
  ],
  validators: [],
};
