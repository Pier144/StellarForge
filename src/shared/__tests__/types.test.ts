import { describe, it, expect } from 'vitest';
import type { ParadoxNode, ParadoxColor, ParadoxFile } from '../types/paradox';
import type { ProjectMetadata } from '../types/project';
import type { CategorySchema, FieldDefinition } from '../types/categories';

describe('Shared types compile correctly', () => {
  it('ParadoxNode accepts valid structures', () => {
    const node: ParadoxNode = {
      key: 'trait_intelligent',
      operator: '=',
      value: [
        { key: 'cost', operator: '=', value: 2 },
        { key: 'modifier', operator: '=', value: [
          { key: 'planet_researchers_produces_mult', operator: '=', value: 0.1 }
        ]},
      ],
    };
    expect(node.key).toBe('trait_intelligent');
  });

  it('ParadoxColor holds HSV values', () => {
    const color: ParadoxColor = { type: 'hsv', values: [0.5, 0.8, 0.9] };
    expect(color.type).toBe('hsv');
    expect(color.values).toHaveLength(3);
  });

  it('ProjectMetadata has required fields', () => {
    const meta: ProjectMetadata = {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: ['Gameplay'],
      description: 'A test mod',
      author: 'Tester',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      stellarforgeVersion: '0.1.0',
    };
    expect(meta.name).toBe('Test Mod');
  });

  it('FieldDefinition supports all field types', () => {
    const field: FieldDefinition = {
      key: 'test',
      label: { en: 'Test', it: 'Test' },
      type: 'trigger-block',
      required: false,
      group: 'conditions',
    };
    expect(field.type).toBe('trigger-block');
  });
});
