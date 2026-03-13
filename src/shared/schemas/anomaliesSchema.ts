// src/shared/schemas/anomaliesSchema.ts
import type { CategorySchema } from '../types/categories';

export const anomaliesSchema: CategorySchema = {
  category: 'anomalies',
  gameFolder: 'common/anomalies/',
  outputPath: 'common/anomalies/',
  displayName: { en: 'Anomalies', it: 'Anomalie' },
  fields: [
    { key: 'key', label: { en: 'Anomaly ID', it: 'ID Anomalia' }, type: 'text', required: true, group: 'general' },
    { key: 'level', label: { en: 'Level', it: 'Livello' }, type: 'number', required: false, default: 1, group: 'general' },
    { key: 'picture', label: { en: 'Picture', it: 'Immagine' }, type: 'icon', required: false, group: 'general' },
    { key: 'spawn_chance', label: { en: 'Spawn Chance', it: 'Probabilità Spawn' }, type: 'trigger-block', required: false, group: 'conditions' },
    { key: 'on_success', label: { en: 'On Success Effects', it: 'Effetti al Successo' }, type: 'effect-block', required: false, group: 'effects' },
  ],
  validators: [],
};
