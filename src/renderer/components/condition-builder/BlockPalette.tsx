// src/renderer/components/condition-builder/BlockPalette.tsx
import { useState } from 'react';
import type { BlockType } from './conditionSerializer';

interface PaletteItem {
  name: string;
  type: BlockType;
  description: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Triggers (blue)
  { name: 'has_ethic', type: 'trigger', description: 'Country has ethic' },
  { name: 'has_civic', type: 'trigger', description: 'Country has civic' },
  { name: 'has_technology', type: 'trigger', description: 'Has researched technology' },
  { name: 'has_trait', type: 'trigger', description: 'Species has trait' },
  { name: 'is_ai', type: 'trigger', description: 'Is AI controlled' },
  { name: 'is_country_type', type: 'trigger', description: 'Country type check' },
  { name: 'num_pops', type: 'trigger', description: 'Number of pops' },
  { name: 'has_modifier', type: 'trigger', description: 'Has active modifier' },
  { name: 'has_building', type: 'trigger', description: 'Planet has building' },
  { name: 'has_district', type: 'trigger', description: 'Planet has district' },
  { name: 'is_planet_class', type: 'trigger', description: 'Planet class check' },
  { name: 'has_authority', type: 'trigger', description: 'Has government authority' },
  { name: 'has_origin', type: 'trigger', description: 'Has origin' },
  { name: 'years_passed', type: 'trigger', description: 'Years since game start' },
  { name: 'has_resource', type: 'trigger', description: 'Has amount of resource' },
  // Effects (green)
  { name: 'add_modifier', type: 'effect', description: 'Add modifier to scope' },
  { name: 'remove_modifier', type: 'effect', description: 'Remove modifier' },
  { name: 'add_resource', type: 'effect', description: 'Add resource amount' },
  { name: 'set_variable', type: 'effect', description: 'Set scripted variable' },
  { name: 'country_event', type: 'effect', description: 'Fire country event' },
  { name: 'planet_event', type: 'effect', description: 'Fire planet event' },
  { name: 'create_fleet', type: 'effect', description: 'Create new fleet' },
  { name: 'destroy_country', type: 'effect', description: 'Destroy country' },
  { name: 'add_opinion_modifier', type: 'effect', description: 'Add opinion modifier' },
  { name: 'change_government', type: 'effect', description: 'Change government' },
  // Logic (gray)
  { name: 'AND', type: 'logic', description: 'All must be true' },
  { name: 'OR', type: 'logic', description: 'Any must be true' },
  { name: 'NOT', type: 'logic', description: 'Must not be true' },
  { name: 'NOR', type: 'logic', description: 'None must be true' },
  { name: 'NAND', type: 'logic', description: 'Not all true' },
  // Scopes (orange)
  { name: 'owner', type: 'scope', description: 'Planet/fleet owner' },
  { name: 'from', type: 'scope', description: 'Event source scope' },
  { name: 'root', type: 'scope', description: 'Root scope' },
  { name: 'prev', type: 'scope', description: 'Previous scope' },
  { name: 'every_owned_planet', type: 'scope', description: 'Iterate owned planets' },
  { name: 'random_owned_planet', type: 'scope', description: 'Random owned planet' },
  { name: 'any_owned_planet', type: 'scope', description: 'Any owned planet matches' },
  { name: 'capital_scope', type: 'scope', description: 'Capital planet' },
  // Comparisons (yellow)
  { name: 'num_pops', type: 'comparison', description: 'Compare pop count' },
  { name: 'num_districts', type: 'comparison', description: 'Compare district count' },
  { name: 'trigger_value', type: 'comparison', description: 'Compare trigger value' },
];

const TYPE_COLORS: Record<BlockType, string> = {
  trigger: 'border-blue-500 bg-blue-500/10',
  effect: 'border-green-500 bg-green-500/10',
  logic: 'border-gray-500 bg-gray-500/10',
  scope: 'border-orange-500 bg-orange-500/10',
  comparison: 'border-yellow-500 bg-yellow-500/10',
};

const TYPE_LABELS: Record<BlockType, string> = {
  trigger: 'Triggers',
  effect: 'Effects',
  logic: 'Logic',
  scope: 'Scopes',
  comparison: 'Comparisons',
};

interface Props {
  onAdd: (name: string, type: BlockType) => void;
  mode: 'trigger' | 'effect';
}

export function BlockPalette({ onAdd, mode }: Props) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<BlockType | 'all'>('all');

  const filtered = PALETTE_ITEMS.filter(item => {
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase()) &&
      !item.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    // In trigger mode, don't show effects; in effect mode, show all
    if (mode === 'trigger' && item.type === 'effect') return false;
    return true;
  });

  const tabs: (BlockType | 'all')[] =
    mode === 'trigger'
      ? ['all', 'trigger', 'logic', 'scope', 'comparison']
      : ['all', 'effect', 'trigger', 'logic', 'scope', 'comparison'];

  return (
    <div className="w-56 border-r border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] flex flex-col h-full">
      <div className="p-2">
        <input
          className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-2 py-1.5 text-xs text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)]"
          placeholder="Search blocks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-1 px-2 pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-0.5 text-[10px] rounded ${
              activeTab === tab
                ? 'bg-[var(--sf-accent)] text-white'
                : 'text-[var(--sf-text-muted)] hover:text-[var(--sf-text-secondary)]'
            }`}
          >
            {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {filtered.map(item => (
          <button
            key={`${item.type}-${item.name}`}
            onClick={() => onAdd(item.name, item.type)}
            className={`w-full text-left px-2 py-1.5 rounded border text-xs transition-colors hover:brightness-110 ${TYPE_COLORS[item.type]}`}
          >
            <div className="font-mono text-[var(--sf-text-primary)]">{item.name}</div>
            <div className="text-[10px] text-[var(--sf-text-muted)]">{item.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
