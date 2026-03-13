export interface ParadoxNode {
  key: string;
  operator: '=' | '>' | '<' | '>=' | '<=' | '!=';
  value: ParadoxValue;
  comments?: string[];
  inlineComment?: string;
  sourceLocation?: SourceLocation;
}

export interface SourceLocation {
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}

export type ParadoxValue =
  | string
  | number
  | boolean
  | ParadoxNode[]
  | ParadoxListValue[]
  | ParadoxColor;

export type ParadoxListValue = string | number;

export interface ParadoxColor {
  type: 'hsv' | 'rgb';
  values: [number, number, number];
}

export interface ParadoxFile {
  nodes: ParadoxNode[];
  variables: Map<string, number>;
}

export interface ParseError {
  message: string;
  line: number;
  column: number;
}

export interface ParseResult {
  file: ParadoxFile;
  errors: ParseError[];
}
