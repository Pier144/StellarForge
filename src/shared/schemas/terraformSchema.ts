// src/shared/schemas/terraformSchema.ts
import type { CategorySchema } from '../types/categories';

export const terraformSchema: CategorySchema = {
  category: 'terraform',
  gameFolder: 'common/terraform/',
  outputPath: 'common/terraform/',
  displayName: { en: 'Terraform', it: 'Terraformazione' },
  fields: [
    { key: 'key', label: { en: 'Terraform ID', it: 'ID Terraformazione' }, type: 'text', required: true, group: 'general' },
    { key: 'from', label: { en: 'From Planet Class', it: 'Da Classe Pianeta' }, type: 'reference', required: true, group: 'general', referenceCategory: 'planet_classes' },
    { key: 'to', label: { en: 'To Planet Class', it: 'A Classe Pianeta' }, type: 'reference', required: true, group: 'general', referenceCategory: 'planet_classes' },
    { key: 'duration', label: { en: 'Duration (days)', it: 'Durata (giorni)' }, type: 'number', required: false, default: 3600, group: 'general' },
    { key: 'prerequisites', label: { en: 'Required Technologies', it: 'Tecnologie Richieste' }, type: 'multiselect', required: false, group: 'requirements', referenceCategory: 'technologies' },
  ],
  validators: [],
};
