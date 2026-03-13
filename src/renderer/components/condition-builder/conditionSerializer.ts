// src/renderer/components/condition-builder/conditionSerializer.ts
export type BlockType = 'trigger' | 'effect' | 'scope' | 'logic' | 'comparison';

export interface Block {
  id: string;
  type: BlockType;
  name: string;
  params: Record<string, unknown>;
  children: Block[];
}

export function serializeBlocks(blocks: Block[], indent: number = 0): string {
  const tab = '\t'.repeat(indent);
  const lines: string[] = [];

  for (const block of blocks) {
    if (block.type === 'comparison') {
      const op = (block.params.operator as string) ?? '=';
      const val = block.params.value ?? 'yes';
      lines.push(`${tab}${block.name} ${op} ${val}`);
    } else if (block.type === 'logic') {
      lines.push(`${tab}${block.name} = {`);
      if (block.children.length > 0) {
        lines.push(serializeBlocks(block.children, indent + 1));
      }
      lines.push(`${tab}}`);
    } else if (block.type === 'scope') {
      lines.push(`${tab}${block.name} = {`);
      if (block.children.length > 0) {
        lines.push(serializeBlocks(block.children, indent + 1));
      }
      lines.push(`${tab}}`);
    } else {
      // trigger or effect
      if (block.children.length > 0) {
        lines.push(`${tab}${block.name} = {`);
        // Add params as key = value inside the block
        for (const [k, v] of Object.entries(block.params)) {
          if (v !== undefined && v !== '') {
            lines.push(`${tab}\t${k} = ${typeof v === 'string' ? `"${v}"` : v}`);
          }
        }
        lines.push(serializeBlocks(block.children, indent + 1));
        lines.push(`${tab}}`);
      } else if (Object.keys(block.params).length > 0) {
        const firstKey = Object.keys(block.params)[0];
        const firstVal = block.params[firstKey];
        if (Object.keys(block.params).length === 1 && firstKey === 'value') {
          lines.push(`${tab}${block.name} = ${firstVal}`);
        } else {
          lines.push(`${tab}${block.name} = {`);
          for (const [k, v] of Object.entries(block.params)) {
            if (v !== undefined && v !== '') {
              lines.push(`${tab}\t${k} = ${typeof v === 'string' ? `"${v}"` : v}`);
            }
          }
          lines.push(`${tab}}`);
        }
      } else {
        lines.push(`${tab}${block.name} = yes`);
      }
    }
  }

  return lines.join('\n');
}
