// src/shared/schemas/relicsSchema.ts
import type { CategorySchema } from '../types/categories';

export const relicsSchema: CategorySchema = {
  category: 'relics',
  gameFolder: 'common/relics/',
  outputPath: 'common/relics/',
  displayName: { en: 'Relics', it: 'Reliquie' },
  fields: [
    { key: 'key', label: { en: 'Relic ID', it: 'ID Reliquia' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'score', label: { en: 'Score Value', it: 'Valore Punteggio' }, type: 'number', required: false, default: 0, group: 'general' },
    { key: 'passive_effect', label: { en: 'Passive Effect', it: 'Effetto Passivo' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'active_effect', label: { en: 'Active Effect', it: 'Effetto Attivo' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
