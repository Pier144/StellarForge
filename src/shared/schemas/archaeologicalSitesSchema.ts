// src/shared/schemas/archaeologicalSitesSchema.ts
import type { CategorySchema } from '../types/categories';

export const archaeologicalSitesSchema: CategorySchema = {
  category: 'archaeological_sites',
  gameFolder: 'common/archaeological_sites/',
  outputPath: 'common/archaeological_sites/',
  displayName: { en: 'Archaeological Sites', it: 'Siti Archeologici' },
  fields: [
    { key: 'key', label: { en: 'Site ID', it: 'ID Sito' }, type: 'text', required: true, group: 'general' },
    { key: 'picture', label: { en: 'Picture', it: 'Immagine' }, type: 'icon', required: false, group: 'general' },
    { key: 'num_chapters', label: { en: 'Number of Chapters', it: 'Numero Capitoli' }, type: 'number', required: false, default: 5, group: 'general' },
    { key: 'on_roll_failed', label: { en: 'On Roll Failed', it: 'Al Fallimento Dado' }, type: 'effect-block', required: false, group: 'effects' },
    { key: 'on_roll_success', label: { en: 'On Roll Success', it: 'Al Successo Dado' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
