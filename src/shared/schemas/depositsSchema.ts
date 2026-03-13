// src/shared/schemas/depositsSchema.ts
import type { CategorySchema } from '../types/categories';

export const depositsSchema: CategorySchema = {
  category: 'deposits',
  gameFolder: 'common/deposits/',
  outputPath: 'common/deposits/',
  displayName: { en: 'Deposits', it: 'Giacimenti' },
  fields: [
    { key: 'key', label: { en: 'Deposit ID', it: 'ID Giacimento' }, type: 'text', required: true, group: 'general' },
    { key: 'icon', label: { en: 'Icon', it: 'Icona' }, type: 'icon', required: false, group: 'general' },
    { key: 'resources', label: { en: 'Resource Output', it: 'Output Risorse' }, type: 'resource-block', required: false, group: 'effects' },
    { key: 'planet_modifier', label: { en: 'Planet Modifiers', it: 'Modificatori Pianeta' }, type: 'modifier-list', required: false, group: 'effects' },
    { key: 'potential', label: { en: 'Potential', it: 'Potenziale' }, type: 'trigger-block', required: false, group: 'conditions' },
  ],
  validators: [],
};
