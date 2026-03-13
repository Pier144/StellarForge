// src/shared/schemas/scriptedEffectsSchema.ts
import type { CategorySchema } from '../types/categories';

export const scriptedEffectsSchema: CategorySchema = {
  category: 'scripted_effects',
  gameFolder: 'common/scripted_effects/',
  outputPath: 'common/scripted_effects/',
  displayName: { en: 'Scripted Effects', it: 'Effetti Script' },
  fields: [
    { key: 'key', label: { en: 'Effect ID', it: 'ID Effetto' }, type: 'text', required: true, group: 'general' },
    { key: 'effect', label: { en: 'Effect Block', it: 'Blocco Effetto' }, type: 'effect-block', required: true, group: 'effects' },
    { key: 'parameters', label: { en: 'Parameters', it: 'Parametri' }, type: 'text', required: false, group: 'general' },
  ],
  validators: [],
};
