// src/shared/schemas/bombardmentStancesSchema.ts
import type { CategorySchema } from '../types/categories';

export const bombardmentStancesSchema: CategorySchema = {
  category: 'bombardment_stances',
  gameFolder: 'common/bombardment_stances/',
  outputPath: 'common/bombardment_stances/',
  displayName: { en: 'Bombardment Stances', it: 'Posizioni Bombardamento' },
  fields: [
    { key: 'key', label: { en: 'Stance ID', it: 'ID Posizione' }, type: 'text', required: true, group: 'general' },
    { key: 'pop_killed_per_day', label: { en: 'Pops Killed per Day', it: 'Pop Uccisi al Giorno' }, type: 'number', required: false, default: 0, group: 'stats' },
    { key: 'orbital_bombardment_damage', label: { en: 'Orbital Bombardment Damage', it: 'Danno Bombardamento Orbitale' }, type: 'number', required: false, default: 1.0, group: 'stats' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
