// src/shared/schemas/shipSizesSchema.ts
import type { CategorySchema } from '../types/categories';

export const shipSizesSchema: CategorySchema = {
  category: 'ship_sizes',
  gameFolder: 'common/ship_sizes/',
  outputPath: 'common/ship_sizes/',
  displayName: { en: 'Ship Sizes', it: 'Dimensioni Navi' },
  fields: [
    { key: 'key', label: { en: 'Ship Size ID', it: 'ID Dimensione Nave' }, type: 'text', required: true, group: 'general' },
    { key: 'max_speed', label: { en: 'Max Speed', it: 'Velocità Massima' }, type: 'number', required: false, group: 'stats' },
    { key: 'acceleration', label: { en: 'Acceleration', it: 'Accelerazione' }, type: 'number', required: false, group: 'stats' },
    { key: 'max_hitpoints', label: { en: 'Max Hitpoints', it: 'Punti Vita Massimi' }, type: 'number', required: false, group: 'stats' },
    { key: 'naval_cap_cost', label: { en: 'Naval Cap Cost', it: 'Costo Capacità Navale' }, type: 'number', required: false, default: 1, group: 'stats' },
  ],
  validators: [],
};
