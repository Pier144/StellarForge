// src/shared/schemas/casusBelliSchema.ts
import type { CategorySchema } from '../types/categories';

export const casusBelliSchema: CategorySchema = {
  category: 'casus_belli',
  gameFolder: 'common/casus_belli/',
  outputPath: 'common/casus_belli/',
  displayName: { en: 'Casus Belli', it: 'Casus Belli' },
  fields: [
    { key: 'key', label: { en: 'Casus Belli ID', it: 'ID Casus Belli' }, type: 'text', required: true, group: 'general' },
    { key: 'months_valid', label: { en: 'Months Valid', it: 'Mesi di Validità' }, type: 'number', required: false, default: 12, group: 'general' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'is_valid', label: { en: 'Is Valid', it: 'È Valido' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
