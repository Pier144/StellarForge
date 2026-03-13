import type { ParadoxNode, ParadoxValue, ParadoxColor, ParadoxListValue } from '@shared/types/paradox';

export interface SerializeOptions {
  indent?: string;
  bom?: boolean;
}

export function serialize(nodes: ParadoxNode[], options: SerializeOptions = {}): string {
  const indent = options.indent ?? '\t';
  let output = '';
  if (options.bom) output = '\uFEFF';

  output += serializeNodes(nodes, 0, indent);
  return output;
}

function serializeNodes(nodes: ParadoxNode[], depth: number, indent: string): string {
  let output = '';
  for (const node of nodes) {
    output += serializeNode(node, depth, indent);
  }
  return output;
}

function serializeNode(node: ParadoxNode, depth: number, indent: string): string {
  let output = '';
  const prefix = indent.repeat(depth);

  if (node.comments) {
    for (const comment of node.comments) {
      output += `${prefix}#${comment}\n`;
    }
  }

  output += `${prefix}${node.key} ${node.operator} `;
  output += serializeValue(node.value, depth, indent);

  if (node.inlineComment) {
    output = output.trimEnd() + ` #${node.inlineComment}\n`;
  }

  return output;
}

function serializeValue(value: ParadoxValue, depth: number, indent: string): string {
  if (typeof value === 'boolean') {
    return `${value ? 'yes' : 'no'}\n`;
  }

  if (typeof value === 'number') {
    return `${value}\n`;
  }

  if (typeof value === 'string') {
    if (/^[a-zA-Z_][a-zA-Z0-9_.:\-]*$/.test(value) && value !== 'yes' && value !== 'no') {
      return `${value}\n`;
    }
    return `"${value}"\n`;
  }

  if (isColor(value)) {
    return `${value.type} { ${value.values.join(' ')} }\n`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '{ }\n';
    }

    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'key' in value[0]) {
      let output = '{\n';
      output += serializeNodes(value as ParadoxNode[], depth + 1, indent);
      output += `${indent.repeat(depth)}}\n`;
      return output;
    }

    const items = (value as ParadoxListValue[]).map(item => {
      if (typeof item === 'string') {
        if (/^[a-zA-Z_][a-zA-Z0-9_.:\-]*$/.test(item)) return item;
        return `"${item}"`;
      }
      return String(item);
    });
    return `{ ${items.join(' ')} }\n`;
  }

  return `${String(value)}\n`;
}

function isColor(value: unknown): value is ParadoxColor {
  return typeof value === 'object' && value !== null && 'type' in value && 'values' in value
    && ((value as ParadoxColor).type === 'hsv' || (value as ParadoxColor).type === 'rgb');
}
