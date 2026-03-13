// src/shared/schemas/warGoalsSchema.ts
import type { CategorySchema } from '../types/categories';

export const warGoalsSchema: CategorySchema = {
  category: 'war_goals',
  gameFolder: 'common/war_goals/',
  outputPath: 'common/war_goals/',
  displayName: { en: 'War Goals', it: 'Obiettivi di Guerra' },
  fields: [
    { key: 'key', label: { en: 'War Goal ID', it: 'ID Obiettivo Guerra' }, type: 'text', required: true, group: 'general' },
    { key: 'type', label: { en: 'Type', it: 'Tipo' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'conquest', label: 'Conquest' }, { value: 'subjugation', label: 'Subjugation' },
        { value: 'liberation', label: 'Liberation' }, { value: 'humiliation', label: 'Humiliation' },
      ] },
    { key: 'casus_belli', label: { en: 'Required Casus Belli', it: 'Casus Belli Richiesto' }, type: 'reference', required: false, group: 'requirements', referenceCategory: 'casus_belli' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
