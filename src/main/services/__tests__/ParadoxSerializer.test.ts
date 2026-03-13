import { describe, it, expect } from 'vitest';
import { serialize } from '../ParadoxSerializer';
import { parse } from '../ParadoxParser';
import type { ParadoxNode } from '@shared/types/paradox';

describe('ParadoxSerializer', () => {
  it('serializes simple key = string', () => {
    const nodes: ParadoxNode[] = [
      { key: 'name', operator: '=', value: 'Test Mod' },
    ];
    expect(serialize(nodes)).toBe('name = "Test Mod"\n');
  });

  it('serializes key = number', () => {
    const nodes: ParadoxNode[] = [
      { key: 'cost', operator: '=', value: 2 },
    ];
    expect(serialize(nodes)).toBe('cost = 2\n');
  });

  it('serializes key = float', () => {
    const nodes: ParadoxNode[] = [
      { key: 'weight', operator: '=', value: 0.5 },
    ];
    expect(serialize(nodes)).toBe('weight = 0.5\n');
  });

  it('serializes key = boolean', () => {
    const nodes: ParadoxNode[] = [
      { key: 'initial', operator: '=', value: true },
    ];
    expect(serialize(nodes)).toBe('initial = yes\n');
  });

  it('serializes nested blocks with indentation', () => {
    const nodes: ParadoxNode[] = [
      {
        key: 'trait_smart', operator: '=', value: [
          { key: 'cost', operator: '=', value: 2 },
          { key: 'initial', operator: '=', value: true },
        ],
      },
    ];
    const expected = `trait_smart = {\n\tcost = 2\n\tinitial = yes\n}\n`;
    expect(serialize(nodes)).toBe(expected);
  });

  it('serializes value lists', () => {
    const nodes: ParadoxNode[] = [
      { key: 'allowed_archetypes', operator: '=', value: ['BIOLOGICAL', 'LITHOID'] },
    ];
    expect(serialize(nodes)).toBe('allowed_archetypes = { BIOLOGICAL LITHOID }\n');
  });

  it('serializes hsv colors', () => {
    const nodes: ParadoxNode[] = [
      { key: 'color', operator: '=', value: { type: 'hsv' as const, values: [0.5, 0.8, 0.9] as [number, number, number] } },
    ];
    expect(serialize(nodes)).toBe('color = hsv { 0.5 0.8 0.9 }\n');
  });

  it('serializes comparison operators', () => {
    const nodes: ParadoxNode[] = [
      { key: 'num_pops', operator: '>', value: 10 },
    ];
    expect(serialize(nodes)).toBe('num_pops > 10\n');
  });

  it('preserves comments', () => {
    const nodes: ParadoxNode[] = [
      { key: 'cost', operator: '=', value: 2, comments: [' This is the cost'] },
    ];
    expect(serialize(nodes)).toBe('# This is the cost\ncost = 2\n');
  });

  it('preserves inline comments', () => {
    const nodes: ParadoxNode[] = [
      { key: 'cost', operator: '=', value: 2, inlineComment: ' point cost' },
    ];
    expect(serialize(nodes)).toBe('cost = 2 # point cost\n');
  });

  it('round-trips: parse then serialize produces equivalent output', () => {
    const original = `trait_intelligent = {
\tcost = 2
\tallowed_archetypes = { BIOLOGICAL LITHOID }
\tmodifier = {
\t\tplanet_researchers_produces_mult = 0.10
\t}
}
`;
    const parsed = parse(original);
    const serialized = serialize(parsed.file.nodes);
    const reparsed = parse(serialized);
    expect(reparsed.errors).toHaveLength(0);
    expect(reparsed.file.nodes[0].key).toBe('trait_intelligent');
  });
});
