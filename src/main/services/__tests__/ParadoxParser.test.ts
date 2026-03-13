import { describe, it, expect } from 'vitest';
import { parse } from '../ParadoxParser';

describe('ParadoxParser', () => {
  it('parses simple key = string', () => {
    const result = parse('name = "Test Mod"');
    expect(result.errors).toHaveLength(0);
    expect(result.file.nodes).toHaveLength(1);
    expect(result.file.nodes[0]).toEqual(expect.objectContaining({
      key: 'name',
      operator: '=',
      value: 'Test Mod',
    }));
  });

  it('parses key = number', () => {
    const result = parse('cost = 2');
    expect(result.file.nodes[0].value).toBe(2);
  });

  it('parses key = float', () => {
    const result = parse('weight = 0.5');
    expect(result.file.nodes[0].value).toBe(0.5);
  });

  it('parses key = boolean (yes/no)', () => {
    const result = parse('initial = yes');
    expect(result.file.nodes[0].value).toBe(true);
  });

  it('parses nested block', () => {
    const result = parse(`trait_intelligent = {
  cost = 2
  initial = yes
}`);
    expect(result.errors).toHaveLength(0);
    const trait = result.file.nodes[0];
    expect(trait.key).toBe('trait_intelligent');
    expect(Array.isArray(trait.value)).toBe(true);
    const children = trait.value as any[];
    expect(children).toHaveLength(2);
    expect(children[0]).toEqual(expect.objectContaining({ key: 'cost', value: 2 }));
    expect(children[1]).toEqual(expect.objectContaining({ key: 'initial', value: true }));
  });

  it('parses comparison operators', () => {
    const result = parse('num_pops > 10');
    expect(result.file.nodes[0].operator).toBe('>');
    expect(result.file.nodes[0].value).toBe(10);
  });

  it('parses @variable definitions', () => {
    const result = parse('@base_cost = 100');
    expect(result.file.variables.get('@base_cost')).toBe(100);
  });

  it('parses hsv color', () => {
    const result = parse('color = hsv { 0.5 0.8 0.9 }');
    expect(result.file.nodes[0].value).toEqual({
      type: 'hsv',
      values: [0.5, 0.8, 0.9],
    });
  });

  it('parses rgb color', () => {
    const result = parse('color = rgb { 255 128 0 }');
    expect(result.file.nodes[0].value).toEqual({
      type: 'rgb',
      values: [255, 128, 0],
    });
  });

  it('parses value list (unkeyed list)', () => {
    const result = parse('allowed_archetypes = { BIOLOGICAL LITHOID MACHINE }');
    const node = result.file.nodes[0];
    expect(node.value).toEqual(['BIOLOGICAL', 'LITHOID', 'MACHINE']);
  });

  it('preserves comments', () => {
    const result = parse(`# This is a trait
trait_smart = {
  cost = 1
}`);
    expect(result.file.nodes[0].comments).toContain(' This is a trait');
  });

  it('preserves inline comments', () => {
    const result = parse('cost = 2 # trait point cost');
    expect(result.file.nodes[0].inlineComment).toBe(' trait point cost');
  });

  it('tracks source locations', () => {
    const result = parse('cost = 2');
    const loc = result.file.nodes[0].sourceLocation;
    expect(loc).toBeDefined();
    expect(loc!.startLine).toBe(1);
  });

  it('handles deeply nested structures', () => {
    const result = parse(`country_event = {
  id = test.1
  trigger = {
    is_at_war = yes
    any_owned_planet = {
      num_pops > 10
    }
  }
  option = {
    name = "OK"
    add_resource = {
      energy = 100
    }
  }
}`);
    expect(result.errors).toHaveLength(0);
    const event = result.file.nodes[0];
    expect(event.key).toBe('country_event');
  });

  it('recovers from syntax errors', () => {
    const result = parse(`trait_one = {
  cost = 2
}
= broken
trait_two = {
  cost = 3
}`);
    expect(result.errors.length).toBeGreaterThan(0);
    const keys = result.file.nodes.map(n => n.key);
    expect(keys).toContain('trait_one');
    expect(keys).toContain('trait_two');
  });

  it('parses real Stellaris trait syntax', () => {
    const input = `trait_intelligent = {
	cost = 2
	opposites = { "trait_nerve_stapled" "trait_presapient_proles" }
	allowed_archetypes = { BIOLOGICAL LITHOID }
	modifier = {
		planet_researchers_produces_mult = 0.10
	}
	slave_cost = {
		energy = 500
	}
}`;
    const result = parse(input);
    expect(result.errors).toHaveLength(0);
    const trait = result.file.nodes[0];
    expect(trait.key).toBe('trait_intelligent');
  });
});
