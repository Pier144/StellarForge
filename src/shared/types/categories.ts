export interface CategorySchema {
  category: string;
  gameFolder: string;
  outputPath: string;
  displayName: { en: string; it: string };
  fields: FieldDefinition[];
  validators: ValidatorRule[];
}

export interface FieldDefinition {
  key: string;
  label: { en: string; it: string };
  type: FieldType;
  required: boolean;
  default?: unknown;
  options?: SelectOption[];
  referenceCategory?: string;
  tooltip?: { en: string; it: string };
  group?: string;
  condition?: FieldCondition;
}

export type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'modifier-list'
  | 'trigger-block'
  | 'effect-block'
  | 'icon'
  | 'color'
  | 'reference'
  | 'event-options'
  | 'resource-block';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldCondition {
  field: string;
  value: unknown;
}

export interface ValidatorRule {
  rule: string;
  params: Record<string, unknown>;
}

export interface ValidationResult {
  level: 'error' | 'warning' | 'info';
  message: string;
  category?: string;
  itemKey?: string;
  field?: string;
  line?: number;
}

export type CategoryGroup =
  | 'empire'
  | 'economy'
  | 'tech'
  | 'military'
  | 'exploration'
  | 'scripting'
  | 'graphics'
  | 'localisation';

export interface CategoryMeta {
  category: string;
  group: CategoryGroup;
  displayName: { en: string; it: string };
  icon: string;
}
