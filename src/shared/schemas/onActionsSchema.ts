// src/shared/schemas/onActionsSchema.ts
import type { CategorySchema } from '../types/categories';

export const onActionsSchema: CategorySchema = {
  category: 'on_actions',
  gameFolder: 'common/on_actions/',
  outputPath: 'common/on_actions/',
  displayName: { en: 'On Actions', it: 'On Actions' },
  fields: [
    { key: 'key', label: { en: 'On Action ID', it: 'ID On Action' }, type: 'text', required: true, group: 'general' },
    { key: 'events', label: { en: 'Events to Fire', it: 'Eventi da Attivare' }, type: 'multiselect', required: false, group: 'effects', referenceCategory: 'events' },
    { key: 'effect', label: { en: 'Direct Effects', it: 'Effetti Diretti' }, type: 'effect-block', required: false, group: 'effects' },
    { key: 'trigger', label: { en: 'Trigger Condition', it: 'Condizione Trigger' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
