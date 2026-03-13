// src/shared/schemas/policiesSchema.ts
import type { CategorySchema } from '../types/categories';

export const policiesSchema: CategorySchema = {
  category: 'policies',
  gameFolder: 'common/policies/',
  outputPath: 'common/policies/',
  displayName: { en: 'Policies', it: 'Politiche' },
  fields: [
    { key: 'key', label: { en: 'Policy ID', it: 'ID Politica' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'allow', label: { en: 'Allow', it: 'Consenti' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'on_enabled', label: { en: 'On Enabled Effects', it: 'Effetti All\'Abilitazione' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
