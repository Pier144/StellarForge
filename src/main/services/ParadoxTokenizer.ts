export enum TokenType {
  Identifier = 'Identifier',
  QuotedString = 'QuotedString',
  Number = 'Number',
  Boolean = 'Boolean',
  Operator = 'Operator',
  OpenBrace = 'OpenBrace',
  CloseBrace = 'CloseBrace',
  Variable = 'Variable',
  Comment = 'Comment',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  while (pos < input.length) {
    const ch = input[pos];

    // Skip whitespace (not newlines)
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      pos++;
      col++;
      continue;
    }

    // Newlines
    if (ch === '\n') {
      pos++;
      line++;
      col = 1;
      continue;
    }

    // Comments
    if (ch === '#') {
      const startCol = col;
      pos++; // skip #
      col++;
      let comment = '';
      while (pos < input.length && input[pos] !== '\n') {
        comment += input[pos];
        pos++;
        col++;
      }
      tokens.push({ type: TokenType.Comment, value: comment, line, col: startCol });
      continue;
    }

    // Braces
    if (ch === '{') {
      tokens.push({ type: TokenType.OpenBrace, value: '{', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '}') {
      tokens.push({ type: TokenType.CloseBrace, value: '}', line, col });
      pos++;
      col++;
      continue;
    }

    // Operators: >=, <=, !=, >, <, =
    if (ch === '>' || ch === '<' || ch === '!' || ch === '=') {
      const startCol = col;
      if ((ch === '>' || ch === '<' || ch === '!') && pos + 1 < input.length && input[pos + 1] === '=') {
        tokens.push({ type: TokenType.Operator, value: ch + '=', line, col: startCol });
        pos += 2;
        col += 2;
        continue;
      }
      tokens.push({ type: TokenType.Operator, value: ch, line, col: startCol });
      pos++;
      col++;
      continue;
    }

    // Quoted strings
    if (ch === '"') {
      const startCol = col;
      pos++; // skip opening quote
      col++;
      let str = '';
      while (pos < input.length && input[pos] !== '"') {
        if (input[pos] === '\\' && pos + 1 < input.length) {
          str += input[pos + 1];
          pos += 2;
          col += 2;
        } else {
          if (input[pos] === '\n') { line++; col = 0; }
          str += input[pos];
          pos++;
          col++;
        }
      }
      if (pos < input.length) { pos++; col++; } // skip closing quote
      tokens.push({ type: TokenType.QuotedString, value: str, line, col: startCol });
      continue;
    }

    // @variables
    if (ch === '@') {
      const startCol = col;
      let varName = '@';
      pos++;
      col++;
      while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
        varName += input[pos];
        pos++;
        col++;
      }
      tokens.push({ type: TokenType.Variable, value: varName, line, col: startCol });
      continue;
    }

    // Numbers (including negative)
    if (/[0-9]/.test(ch) || (ch === '-' && pos + 1 < input.length && /[0-9]/.test(input[pos + 1]))) {
      const startCol = col;
      let num = '';
      if (ch === '-') { num = '-'; pos++; col++; }
      while (pos < input.length && /[0-9.]/.test(input[pos])) {
        num += input[pos];
        pos++;
        col++;
      }
      if (pos < input.length && /[a-zA-Z_]/.test(input[pos])) {
        let ident = num;
        while (pos < input.length && /[a-zA-Z0-9_.\-:]/.test(input[pos])) {
          ident += input[pos];
          pos++;
          col++;
        }
        tokens.push({ type: TokenType.Identifier, value: ident, line, col: startCol });
      } else {
        tokens.push({ type: TokenType.Number, value: num, line, col: startCol });
      }
      continue;
    }

    // Identifiers (and yes/no booleans)
    if (/[a-zA-Z_]/.test(ch)) {
      const startCol = col;
      let ident = '';
      while (pos < input.length && /[a-zA-Z0-9_.\-:]/.test(input[pos])) {
        ident += input[pos];
        pos++;
        col++;
      }
      if (ident === 'yes' || ident === 'no') {
        tokens.push({ type: TokenType.Boolean, value: ident, line, col: startCol });
      } else {
        tokens.push({ type: TokenType.Identifier, value: ident, line, col: startCol });
      }
      continue;
    }

    // Unknown character — skip
    pos++;
    col++;
  }

  return tokens;
}
