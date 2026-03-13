import { tokenize, Token, TokenType } from './ParadoxTokenizer';
import type {
  ParadoxNode, ParadoxFile, ParadoxValue, ParadoxColor,
  ParadoxListValue, ParseError, ParseResult, SourceLocation,
} from '@shared/types/paradox';

export function parse(input: string): ParseResult {
  const tokens = tokenize(input);
  const errors: ParseError[] = [];
  const variables = new Map<string, number>();
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function advance(): Token {
    return tokens[pos++];
  }

  function isAtEnd(): boolean {
    return pos >= tokens.length;
  }

  function collectComments(): string[] {
    const comments: string[] = [];
    while (!isAtEnd() && peek()!.type === TokenType.Comment) {
      comments.push(advance().value);
    }
    return comments;
  }

  function parseValue(): ParadoxValue {
    const token = peek()!;

    // hsv { } or rgb { }
    if (token.type === TokenType.Identifier && (token.value === 'hsv' || token.value === 'rgb')) {
      const colorType = token.value as 'hsv' | 'rgb';
      advance();
      if (peek()?.type === TokenType.OpenBrace) {
        advance();
        const values: number[] = [];
        while (!isAtEnd() && peek()!.type !== TokenType.CloseBrace) {
          if (peek()!.type === TokenType.Number) {
            values.push(parseFloat(advance().value));
          } else {
            advance();
          }
        }
        if (peek()?.type === TokenType.CloseBrace) advance();
        return { type: colorType, values: values.slice(0, 3) as [number, number, number] } satisfies ParadoxColor;
      }
    }

    // Block { ... }
    if (token.type === TokenType.OpenBrace) {
      advance();
      return parseBlock();
    }

    if (token.type === TokenType.QuotedString) {
      return advance().value;
    }

    if (token.type === TokenType.Number) {
      const val = advance().value;
      return val.includes('.') ? parseFloat(val) : parseInt(val, 10);
    }

    if (token.type === TokenType.Boolean) {
      return advance().value === 'yes';
    }

    if (token.type === TokenType.Variable) {
      return advance().value;
    }

    if (token.type === TokenType.Identifier) {
      return advance().value;
    }

    return advance().value;
  }

  function parseBlock(): ParadoxValue {
    let hasOperator = false;
    let depth = 0;

    for (let i = pos; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === TokenType.OpenBrace) depth++;
      if (t.type === TokenType.CloseBrace) {
        if (depth === 0) break;
        depth--;
      }
      if (depth === 0 && t.type === TokenType.Operator) {
        hasOperator = true;
        break;
      }
    }

    if (!hasOperator) {
      const items: ParadoxListValue[] = [];
      while (!isAtEnd() && peek()!.type !== TokenType.CloseBrace) {
        const t = peek()!;
        if (t.type === TokenType.Comment) { advance(); continue; }
        if (t.type === TokenType.QuotedString) { items.push(advance().value); continue; }
        if (t.type === TokenType.Number) {
          const val = advance().value;
          items.push(val.includes('.') ? parseFloat(val) : parseInt(val, 10));
          continue;
        }
        if (t.type === TokenType.Identifier || t.type === TokenType.Boolean) {
          items.push(advance().value);
          continue;
        }
        advance();
      }
      if (peek()?.type === TokenType.CloseBrace) advance();
      return items;
    }

    const nodes: ParadoxNode[] = [];
    while (!isAtEnd() && peek()!.type !== TokenType.CloseBrace) {
      const node = parseNode();
      if (node) nodes.push(node);
    }
    if (peek()?.type === TokenType.CloseBrace) advance();
    return nodes;
  }

  function parseNode(): ParadoxNode | null {
    const comments = collectComments();

    if (isAtEnd() || peek()!.type === TokenType.CloseBrace) return null;

    const keyToken = peek()!;
    const startLine = keyToken.line;
    const startCol = keyToken.col;

    if (keyToken.type === TokenType.Variable) {
      const varName = advance().value;
      if (peek()?.type === TokenType.Operator && peek()!.value === '=') {
        advance();
        if (peek()?.type === TokenType.Number) {
          const val = advance().value;
          const numVal = val.includes('.') ? parseFloat(val) : parseInt(val, 10);
          variables.set(varName, numVal);
        }
      }
      return null;
    }

    if (keyToken.type !== TokenType.Identifier && keyToken.type !== TokenType.QuotedString) {
      errors.push({ message: `Unexpected token: ${keyToken.value}`, line: keyToken.line, column: keyToken.col });
      advance();
      return null;
    }

    const key = advance().value;

    if (isAtEnd() || peek()!.type !== TokenType.Operator) {
      errors.push({ message: `Expected operator after "${key}"`, line: startLine, column: startCol });
      return null;
    }

    const operator = advance().value as ParadoxNode['operator'];
    const value = parseValue();

    let inlineComment: string | undefined;
    if (!isAtEnd() && peek()!.type === TokenType.Comment && peek()!.line === startLine) {
      inlineComment = advance().value;
    }

    const endLine = tokens[pos - 1]?.line ?? startLine;
    const endCol = tokens[pos - 1]?.col ?? startCol;

    const node: ParadoxNode = {
      key,
      operator,
      value,
      sourceLocation: { startLine, startCol, endLine, endCol },
    };

    if (comments.length > 0) node.comments = comments;
    if (inlineComment) node.inlineComment = inlineComment;

    return node;
  }

  const nodes: ParadoxNode[] = [];
  while (!isAtEnd()) {
    const node = parseNode();
    if (node) nodes.push(node);
  }

  return {
    file: { nodes, variables },
    errors,
  };
}
