// src/shared/schemas/tradeConversionsSchema.ts
import type { CategorySchema } from '../types/categories';

export const tradeConversionsSchema: CategorySchema = {
  category: 'trade_conversions',
  gameFolder: 'common/trade_conversions/',
  outputPath: 'common/trade_conversions/',
  displayName: { en: 'Trade Conversions', it: 'Conversioni Commerciali' },
  fields: [
    { key: 'key', label: { en: 'Conversion ID', it: 'ID Conversione' }, type: 'text', required: true, group: 'general' },
    { key: 'convert_to', label: { en: 'Converts To', it: 'Converte In' }, type: 'select', required: true, group: 'general',
      options: [
        { value: 'energy', label: 'Energy' }, { value: 'consumer_goods', label: 'Consumer Goods' },
        { value: 'unity', label: 'Unity' }, { value: 'amenities', label: 'Amenities' },
      ] },
    { key: 'rate', label: { en: 'Conversion Rate', it: 'Tasso Conversione' }, type: 'number', required: true, default: 1, group: 'general' },
  ],
  validators: [],
};
