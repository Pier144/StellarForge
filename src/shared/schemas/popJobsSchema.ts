// src/shared/schemas/popJobsSchema.ts
import type { CategorySchema } from '../types/categories';

export const popJobsSchema: CategorySchema = {
  category: 'pop_jobs',
  gameFolder: 'common/pop_jobs/',
  outputPath: 'common/pop_jobs/',
  displayName: { en: 'Pop Jobs', it: 'Lavori Pop' },
  fields: [
    { key: 'key', label: { en: 'Job ID', it: 'ID Lavoro' }, type: 'text', required: true, group: 'general' },
    { key: 'category', label: { en: 'Job Category', it: 'Categoria Lavoro' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'ruler', label: 'Ruler' }, { value: 'specialist', label: 'Specialist' },
        { value: 'worker', label: 'Worker' }, { value: 'slave', label: 'Slave' },
        { value: 'drone', label: 'Drone' },
      ] },
    { key: 'possible', label: { en: 'Possible Conditions', it: 'Condizioni Possibile' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'resources', label: { en: 'Resource Output', it: 'Output Risorse' }, type: 'resource-block', required: false, group: 'effects' },
    { key: 'pop_modifier', label: { en: 'Pop Modifiers', it: 'Modificatori Pop' }, type: 'modifier-list', required: false, group: 'effects' },
  ],
  validators: [],
};
