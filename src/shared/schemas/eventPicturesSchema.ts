// src/shared/schemas/eventPicturesSchema.ts
import type { CategorySchema } from '../types/categories';

export const eventPicturesSchema: CategorySchema = {
  category: 'event_pictures',
  gameFolder: '',
  outputPath: 'gfx/event_pictures/',
  displayName: { en: 'Event Pictures', it: 'Immagini Evento' },
  fields: [
    { key: 'key', label: { en: 'Picture ID', it: 'ID Immagine' }, type: 'text', required: true, group: 'general' },
    { key: 'texturefile', label: { en: 'Texture File', it: 'File Texture' }, type: 'text', required: true, group: 'general' },
    { key: 'size', label: { en: 'Size (WxH)', it: 'Dimensione (LxA)' }, type: 'text', required: false, group: 'general' },
  ],
  validators: [],
};
