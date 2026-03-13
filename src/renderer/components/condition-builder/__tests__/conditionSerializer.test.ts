// src/renderer/components/condition-builder/__tests__/conditionSerializer.test.ts
import { describe, it, expect } from 'vitest';
import { serializeBlocks, Block } from '../conditionSerializer';

describe('conditionSerializer', () => {
  it('serializes a simple trigger', () => {
    const blocks: Block[] = [
      { id: '1', type: 'trigger', name: 'has_ethic', params: { value: 'ethic_materialist' }, children: [] },
    ];
    expect(serializeBlocks(blocks)).toBe('has_ethic = ethic_materialist');
  });

  it('serializes nested logic blocks', () => {
    const blocks: Block[] = [
      {
        id: '1', type: 'logic', name: 'AND', params: {}, children: [
          { id: '2', type: 'trigger', name: 'is_ai', params: { value: 'no' }, children: [] },
          { id: '3', type: 'trigger', name: 'num_pops', params: {}, children: [] },
        ],
      },
    ];
    const result = serializeBlocks(blocks);
    expect(result).toContain('AND = {');
    expect(result).toContain('\tis_ai = no');
  });

  it('serializes scope blocks', () => {
    const blocks: Block[] = [
      {
        id: '1', type: 'scope', name: 'owner', params: {}, children: [
          { id: '2', type: 'trigger', name: 'is_country_type', params: { value: 'default' }, children: [] },
        ],
      },
    ];
    const result = serializeBlocks(blocks);
    expect(result).toContain('owner = {');
    expect(result).toContain('\tis_country_type = default');
  });

  it('serializes comparison blocks', () => {
    const blocks: Block[] = [
      { id: '1', type: 'comparison', name: 'num_pops', params: { operator: '>=', value: 10 }, children: [] },
    ];
    expect(serializeBlocks(blocks)).toBe('num_pops >= 10');
  });

  it('serializes effect blocks with params', () => {
    const blocks: Block[] = [
      { id: '1', type: 'effect', name: 'add_modifier', params: { modifier: 'mod_happy', days: 360 }, children: [] },
    ];
    const result = serializeBlocks(blocks);
    expect(result).toContain('add_modifier = {');
    expect(result).toContain('\tmodifier = "mod_happy"');
    expect(result).toContain('\tdays = 360');
  });
});
