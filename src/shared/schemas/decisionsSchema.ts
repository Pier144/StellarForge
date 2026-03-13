// src/shared/schemas/decisionsSchema.ts
import type { CategorySchema } from '../types/categories';

export const decisionsSchema: CategorySchema = {
  category: 'decisions',
  gameFolder: 'common/decisions/',
  outputPath: 'common/decisions/',
  displayName: { en: 'Decisions', it: 'Decisioni' },
  fields: [
    { key: 'key', label: { en: 'Decision ID', it: 'ID Decisione' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'allow', label: { en: 'Allow', it: 'Consenti' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'effect', label: { en: 'Effects', it: 'Effetti' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
