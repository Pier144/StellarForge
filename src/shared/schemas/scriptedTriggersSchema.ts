// src/shared/schemas/scriptedTriggersSchema.ts
import type { CategorySchema } from '../types/categories';

export const scriptedTriggersSchema: CategorySchema = {
  category: 'scripted_triggers',
  gameFolder: 'common/scripted_triggers/',
  outputPath: 'common/scripted_triggers/',
  displayName: { en: 'Scripted Triggers', it: 'Trigger Script' },
  fields: [
    { key: 'key', label: { en: 'Trigger ID', it: 'ID Trigger' }, type: 'text', required: true, group: 'general' },
    { key: 'trigger', label: { en: 'Trigger Block', it: 'Blocco Trigger' }, type: 'trigger-block', required: true, group: 'conditions' },
    { key: 'parameters', label: { en: 'Parameters', it: 'Parametri' }, type: 'text', required: false, group: 'general' },
  ],
  validators: [],
};
