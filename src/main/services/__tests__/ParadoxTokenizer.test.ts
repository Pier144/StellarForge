import { describe, it, expect } from 'vitest';
import { tokenize, TokenType } from '../ParadoxTokenizer';

describe('ParadoxTokenizer', () => {
  it('tokenizes simple key = value', () => {
    const tokens = tokenize('name = "Test"');
    expect(tokens).toEqual([
      { type: TokenType.Identifier, value: 'name', line: 1, col: 1 },
      { type: TokenType.Operator, value: '=', line: 1, col: 6 },
      { type: TokenType.QuotedString, value: 'Test', line: 1, col: 8 },
    ]);
  });

  it('tokenizes numbers (int and float)', () => {
    const tokens = tokenize('cost = 2\nweight = 0.5');
    expect(tokens[2].type).toBe(TokenType.Number);
    expect(tokens[2].value).toBe('2');
    expect(tokens[5].type).toBe(TokenType.Number);
    expect(tokens[5].value).toBe('0.5');
  });

  it('tokenizes negative numbers', () => {
    const tokens = tokenize('cost = -3');
    expect(tokens[2].type).toBe(TokenType.Number);
    expect(tokens[2].value).toBe('-3');
  });

  it('tokenizes yes/no as booleans', () => {
    const tokens = tokenize('initial = yes\nrandomized = no');
    expect(tokens[2]).toEqual(expect.objectContaining({ type: TokenType.Boolean, value: 'yes' }));
    expect(tokens[5]).toEqual(expect.objectContaining({ type: TokenType.Boolean, value: 'no' }));
  });

  it('tokenizes braces', () => {
    const tokens = tokenize('modifier = { }');
    expect(tokens[2].type).toBe(TokenType.OpenBrace);
    expect(tokens[3].type).toBe(TokenType.CloseBrace);
  });

  it('tokenizes comparison operators', () => {
    const tokens = tokenize('num_pops > 10\ncount >= 5\nvalue != 0\namount < 3\nlevel <= 2');
    expect(tokens[1].value).toBe('>');
    expect(tokens[4].value).toBe('>=');
    expect(tokens[7].value).toBe('!=');
    expect(tokens[10].value).toBe('<');
    expect(tokens[13].value).toBe('<=');
  });

  it('tokenizes @variables', () => {
    const tokens = tokenize('@cost = 100\ncost = @cost');
    expect(tokens[0]).toEqual(expect.objectContaining({ type: TokenType.Variable, value: '@cost' }));
    expect(tokens[5]).toEqual(expect.objectContaining({ type: TokenType.Variable, value: '@cost' }));
  });

  it('tokenizes comments', () => {
    const tokens = tokenize('# This is a comment\nname = "Test"');
    expect(tokens[0]).toEqual(expect.objectContaining({ type: TokenType.Comment, value: ' This is a comment' }));
  });

  it('tokenizes inline comments', () => {
    const tokens = tokenize('cost = 2 # inline comment');
    expect(tokens[3]).toEqual(expect.objectContaining({ type: TokenType.Comment, value: ' inline comment' }));
  });

  it('tokenizes hsv color', () => {
    const tokens = tokenize('color = hsv { 0.5 0.8 0.9 }');
    expect(tokens[2]).toEqual(expect.objectContaining({ type: TokenType.Identifier, value: 'hsv' }));
  });

  it('tokenizes rgb color', () => {
    const tokens = tokenize('color = rgb { 255 128 0 }');
    expect(tokens[2]).toEqual(expect.objectContaining({ type: TokenType.Identifier, value: 'rgb' }));
  });

  it('handles multiline blocks', () => {
    const input = `trait_intelligent = {
  cost = 2
  modifier = {
    planet_researchers_produces_mult = 0.10
  }
}`;
    const tokens = tokenize(input);
    const identifiers = tokens.filter(t => t.type === TokenType.Identifier);
    expect(identifiers.map(t => t.value)).toContain('trait_intelligent');
    expect(identifiers.map(t => t.value)).toContain('planet_researchers_produces_mult');
  });
});
