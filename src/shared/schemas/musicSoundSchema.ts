// src/shared/schemas/musicSoundSchema.ts
import type { CategorySchema } from '../types/categories';

export const musicSoundSchema: CategorySchema = {
  category: 'music_sound',
  gameFolder: '',
  outputPath: 'music/',
  displayName: { en: 'Music & Sound', it: 'Musica e Suoni' },
  fields: [
    { key: 'key', label: { en: 'Audio ID', it: 'ID Audio' }, type: 'text', required: true, group: 'general' },
    { key: 'file', label: { en: 'Audio File', it: 'File Audio' }, type: 'text', required: true, group: 'general' },
    { key: 'volume', label: { en: 'Volume', it: 'Volume' }, type: 'number', required: false, default: 0.5, group: 'general' },
    { key: 'type', label: { en: 'Audio Type', it: 'Tipo Audio' }, type: 'select', required: false, group: 'general',
      options: [{ value: 'music', label: 'Music' }, { value: 'sfx', label: 'Sound Effect' }, { value: 'ambient', label: 'Ambient' }] },
  ],
  validators: [],
};
